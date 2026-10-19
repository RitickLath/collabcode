import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginAuthDto, RegisterAuthDto } from './auth.dto';
import { IsPublic } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Get('check-username')
  async checkUsername(@Query('username') username: string) {
    return this.authService.checkUsernameAvailability(username);
  }

  @IsPublic()
  @Post('register')
  async register(@Body() body: RegisterAuthDto) {
    return this.authService.register(body);
  }

  @IsPublic()
  @Get('verify-email')
  async verifyEmail(
    @Query('token') token: string,
    @Query('email') email: string,
  ) {
    return this.authService.verifyEmail(token, email);
  }

  @IsPublic()
  @Post('login')
  async login(
    @Body() body: LoginAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, user } = await this.authService.login(body);

    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      message: 'Logged in successfully',
      user,
      accessToken,
    };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      path: '/',
    });
    return this.authService.logout();
  }

  @Get('me')
  async me(@CurrentUser('sub') userId: string) {
    return this.authService.me(userId);
  }
}
