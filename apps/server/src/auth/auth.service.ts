import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto, RegisterAuthDto } from './auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailQueue } from 'src/mail/queue/mail.queue';
import Redis from 'ioredis';
import * as crypto from 'crypto';
import { BloomFilter } from 'src/common/utils/bloom';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { REDIS_CLIENT } from 'src/redis/redis.module';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    @Inject(REDIS_CLIENT) private redis: Redis,
    private mailQueue: MailQueue,
    private bloom: BloomFilter,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  /**
   * Application bootstrap hook: populates the Bloom filter with all existing usernames
   * to ensure O(1) probabilistic username availability checks without database roundtrips.
   */
  async onModuleInit() {
    try {
      const users = await this.prisma.user.findMany({
        select: { username: true },
      });
      for (const u of users) {
        this.bloom.add(u.username);
      }
      this.logger.log(`Initialized bloom filter with ${users.length} users`);
    } catch (error) {
      this.logger.warn(
        `Could not initialize bloom filter on init: ${error.message}`,
      );
    }
  }

  /**
   * Checks username availability in a two-tier strategy:
   * 1. Fast in-memory Bloom filter lookup (0 false negatives).
   * 2. Candidate confirmation check against PostgreSQL only if the filter returns a positive match.
   */
  async checkUsernameAvailability(username: string) {
    if (!username) {
      throw new BadRequestException('Username is required');
    }

    const normalizedUsername = username.trim().toLowerCase();

    // 1. Fast Bloom Filter check:
    const mightBeTaken = this.bloom.has(normalizedUsername);
    if (!mightBeTaken) {
      return { isAvailable: true };
    }

    // 2. Candidate false-positive check: verify in database
    const user = await this.prisma.user.findUnique({
      where: { username: normalizedUsername },
      select: { id: true },
    });

    return { isAvailable: !user };
  }

  /**
   * Verifies a user's registered email using a temporary token stored in Redis.
   * On success, marks the user account as verified and invalidates the Redis token.
   */
  async verifyEmail(token: string, email: string) {
    if (!token || !email) {
      throw new BadRequestException('Token and email are required');
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Fetch token stored in Redis
    const storedToken = await this.redis.get(`verify:${normalizedEmail}`);

    if (!storedToken) {
      throw new BadRequestException(
        'Verification link is invalid or has expired',
      );
    }

    // 2. Validate token matches
    if (storedToken !== token) {
      throw new BadRequestException('Invalid verification token');
    }

    // 3. Find user in database
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      // Clean up Redis token if already verified
      await this.redis.del(`verify:${normalizedEmail}`);
      return {
        message: 'Email is already verified. You can log in.',
      };
    }

    // 4. Mark user as verified in database
    await this.prisma.user.update({
      where: { email: normalizedEmail },
      data: { isVerified: true },
    });

    // 5. Invalidate token in Redis after successful verification
    await this.redis.del(`verify:${normalizedEmail}`);

    return {
      message: 'Email verified successfully! You can now log in.',
    };
  }

  /**
   * Registers a new user account:
   * 1. Validates unique username and email constraints.
   * 2. Hashes password using bcrypt.
   * 3. Creates user record and updates the in-memory Bloom filter.
   * 4. Enqueues a verification email job via BullMQ (auto-verified in development).
   */
  async register(body: RegisterAuthDto) {
    const normalizedUsername = body.username.trim().toLowerCase();
    const normalizedEmail = body.email.trim().toLowerCase();

    // 1. Check for existing username or email conflict
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: normalizedUsername }, { email: normalizedEmail }],
      },
    });

    if (existingUser) {
      if (existingUser.username === normalizedUsername) {
        throw new ConflictException('Username is already taken');
      }
      throw new ConflictException('Email is already registered');
    }

    // 2. Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const isDev = this.configService.get('NODE_ENV') === 'development';

    // 3. Create User in database
    const user = await this.prisma.user.create({
      data: {
        username: normalizedUsername,
        email: normalizedEmail,
        passwordHash,
        isVerified: isDev,
      },
      select: {
        id: true,
        username: true,
        email: true,
        isVerified: true,
        createdAt: true,
      },
    });

    // 4. Reserve username in BloomFilter immediately
    this.bloom.add(user.username);

    // 5. Generate verification token and enqueue email via BullMQ
    if (!isDev) {
      const verificationToken = crypto.randomUUID();
      await this.redis.set(
        `verify:${user.email}`,
        verificationToken,
        'EX',
        60 * 60 * 24, // 24 hours
      );

      await this.mailQueue.queueVerificationEmail(
        user.email,
        verificationToken,
        user.username,
      );
    }

    return {
      message: isDev
        ? 'User registered successfully (Auto-verified in dev).'
        : 'User registered successfully. Please verify your email.',
      user,
    };
  }

  /**
   * Authenticates user credentials (by email or username), verifies password and email verification status,
   * and generates a signed JWT access token.
   */
  async login(body: LoginAuthDto) {
    const identifier = body.identifier.trim().toLowerCase();

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: identifier }, { email: identifier }],
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      body.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in',
      );
    }

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  /**
   * Performs user logout confirmation.
   */
  async logout() {
    return {
      message: 'Logged out successfully',
    };
  }

  /**
   * Retrieves profile information and timestamps for the currently authenticated user by ID.
   */
  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
