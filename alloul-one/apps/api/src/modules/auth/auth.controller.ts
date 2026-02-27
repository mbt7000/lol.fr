import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly jwt: JwtService) {}

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
    const callback = process.env.OIDC_CALLBACK_URL || 'http://localhost:4000/v1/auth/oidc/callback';
    return {
      provider,
      redirectUrl: `https://auth.example.com/${provider}/authorize?redirect_uri=${encodeURIComponent(callback)}`,
      state: randomUUID(),
    };
  }

  @Post('passwordless/start')
  passwordlessStart(@Body() body: { email: string }) {
    return { status: 'sent', channel: 'email', email: body.email };
  }

  @Post('passwordless/verify')
  passwordlessVerify(@Body() body: { email: string; code: string }, @Res({ passthrough: true }) res: Response) {
    const ok = body.code.length >= 6;
    if (!ok) return { error: 'invalid_code' };

    const permissions = ['org.read', 'org.write', 'rbac.read', 'knowledge.read', 'knowledge.write', 'knowledge.approve', 'search.query', 'search.index', 'audit.read', 'audit.write', 'audit.verify', 'project.read', 'project.write', 'task.read', 'task.write', 'workflow.read', 'workflow.write', 'workflow.run', 'handover.read', 'handover.write', 'social.read', 'social.write', 'marketplace.read', 'marketplace.write', 'billing.read', 'billing.write', 'usage.read', 'usage.write', 'ai.query'];
    const accessToken = this.jwt.sign({ sub: body.email, role: 'owner', permissions, rot: randomUUID() });

    const secure = process.env.NODE_ENV === 'production';
    res.cookie('ao_token', accessToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60,
    });

    return { accessToken, refreshToken: `refresh_${Buffer.from(body.email).toString('hex')}` };
  }

  @Post('session/rotate')
  rotate(@Body() body: { email: string }, @Res({ passthrough: true }) res: Response) {
    const accessToken = this.jwt.sign({ sub: body.email, role: 'owner', rot: randomUUID() });
    const secure = process.env.NODE_ENV === 'production';
    res.cookie('ao_token', accessToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60,
    });
    return { rotated: true };
  }
}
