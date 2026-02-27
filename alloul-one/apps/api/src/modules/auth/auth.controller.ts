import { Body, Controller, Post } from '@nestjs/common';
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
}
