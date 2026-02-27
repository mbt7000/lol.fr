import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Post('login')
  login(@Body() body: { email: string; provider?: string }) {
    return {
      status: 'accepted',
      nextStep: body.provider === 'oidc' ? 'redirect' : 'verify-code',
      email: body.email,
    };
  }

  @Get('oidc/start')
  oidcStart(@Query('provider') provider = 'google') {
    return {
      provider,
      redirectUrl: `https://auth.example.com/${provider}/authorize`,
      state: randomUUID(),
    };
  }

  @Post('passwordless/start')
  passwordlessStart(@Body() body: { email: string }) {
    return { status: 'sent', channel: 'email', email: body.email };
  }

  @Post('passwordless/verify')
  passwordlessVerify(@Body() body: { email: string; code: string }) {
    const ok = body.code.length >= 6;
    return ok
      ? { accessToken: `dev_${Buffer.from(body.email).toString('base64')}`, refreshToken: 'dev_refresh' }
      : { error: 'invalid_code' };
  }
}
