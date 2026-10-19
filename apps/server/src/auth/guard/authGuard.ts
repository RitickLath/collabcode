import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

export interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    username: string;
    email: string;
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeaderOrCookie(request);

    if (!token) {
      throw new UnauthorizedException('Authentication token is missing');
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET');

      const payload = await this.jwtService.verifyAsync(token, { secret });
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeaderOrCookie(request: Request): string | undefined {
    // 1. Authorization header: Bearer <token>
    const [type, headerToken] = request.headers.authorization?.split(' ') ?? [];
    if (type === 'Bearer' && headerToken) {
      return headerToken;
    }

    // 2. Cookie fallback
    const cookies = (request as unknown as { cookies?: Record<string, string> })
      .cookies;
    if (cookies?.accessToken) {
      return cookies.accessToken;
    }

    return undefined;
  }
}
