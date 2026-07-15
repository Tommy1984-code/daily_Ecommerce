import {
  Body, Controller, Post, Req, Res, UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation,
  ApiTags, ApiTooManyRequestsResponse, ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { RefreshGuard } from './guards/refresh.guard';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { StaffLoginDto } from './dto/staff-login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { OtpResponseDto } from './dto/otp-response.dto';
import { VerifyOtpResponseDto } from './dto/verify-otp-response.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('customer/send-otp')
  @Public()
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @ApiOperation({ summary: 'Send OTP', description: 'Sends a one-time password to the customer\'s phone for authentication.' })
  @ApiBody({ type: SendOtpDto })
  @ApiCreatedResponse({ description: 'OTP sent successfully', type: OtpResponseDto })
  @ApiTooManyRequestsResponse({ description: 'Too many OTP requests, please wait' })
  async sendOtp(@Body() body: SendOtpDto) {
    return this.auth.sendOtp(body.phone);
  }

  @Post('customer/verify-otp')
  @Public()
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @ApiOperation({ summary: 'Verify OTP', description: 'Verifies the OTP code sent to the customer\'s phone and issues authentication tokens.' })
  @ApiBody({ type: VerifyOtpDto })
  @ApiCreatedResponse({ description: 'OTP verified, tokens issued', type: VerifyOtpResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired OTP code' })
  @ApiTooManyRequestsResponse({ description: 'Too many verification attempts, please wait' })
  async verifyOtp(
    @Body() body: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.auth.verifyOtp(body.phone, body.code);
    this.setRefreshCookie(res, result.refreshToken);
    return { accessToken: result.accessToken, isNew: result.isNew, user: result.user };
  }

  @Post('staff/login')
  @Public()
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @ApiOperation({ summary: 'Staff login', description: 'Authenticates a staff member using email and password credentials.' })
  @ApiBody({ type: StaffLoginDto })
  @ApiCreatedResponse({ description: 'Login successful, tokens issued', type: LoginResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  @ApiTooManyRequestsResponse({ description: 'Too many login attempts, please wait' })
  async staffLogin(
    @Body() body: StaffLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.auth.staffLogin(body.email, body.password);
    this.setRefreshCookie(res, result.refreshToken);
    return { accessToken: result.accessToken, user: result.user };
  }

  @Post('refresh')
  @Public()
  @UseGuards(RefreshGuard)
  @ApiOperation({ summary: 'Refresh token', description: 'Exchanges a valid refresh token (from httpOnly cookie) for a new access token.' })
  @ApiOkResponse({ description: 'New access token issued', schema: { properties: { accessToken: { type: 'string', nullable: true, example: 'eyJhbGciOiJIUzI1NiIs...' } } } })
  @ApiUnauthorizedResponse({ description: 'Invalid, expired, or reused refresh token' })
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies?.refresh_token;
    if (!token) {
      return { accessToken: null };
    }
    const result = await this.auth.refreshTokens(token);
    this.setRefreshCookie(res, result.refreshToken);
    return { accessToken: result.accessToken };
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout', description: 'Revokes the current refresh token and clears the auth cookie.' })
  @ApiOkResponse({ description: 'Logged out successfully', schema: { properties: { message: { type: 'string', example: 'Logged out' } } } })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing Bearer token' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.refresh_token;
    if (token) {
      await this.auth.logout(token);
    }
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
    return { message: 'Logged out' };
  }

  private setRefreshCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });
  }
}
