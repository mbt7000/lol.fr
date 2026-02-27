import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';

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
  passwordlessVerify(@Body() body: { email: string; code: string }) {
    const ok = body.code.length >= 6;
    if (!ok) return { error: 'invalid_code' };
    const accessToken = this.jwt.sign({ sub: body.email, role: 'owner', permissions: ['org.read', 'org.write', 'rbac.read', 'knowledge.read', 'knowledge.write', 'knowledge.approve', 'search.query', 'search.index', 'audit.read', 'audit.write', 'audit.verify', 'project.read', 'project.write', 'task.read', 'task.write', 'workflow.read', 'workflow.write', 'workflow.run', 'handover.read', 'handover.write', 'social.read', 'social.write', 'marketplace.read', 'marketplace.write', 'billing.read', 'billing.write', 'usage.read', 'usage.write', 'ai.query'] });
    return { accessToken, refreshToken: `refresh_${Buffer.from(body.email).toString('hex')}` };
  }
}
