import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const auth = (req.headers.authorization || '') as string;
    const cookieHeader = (req.headers.cookie || '') as string;
    const cookieToken = cookieHeader
      .split(';')
      .map((x) => x.trim())
      .find((x) => x.startsWith('ao_token='))
      ?.split('=')[1];
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : cookieToken;
    if (!token) throw new UnauthorizedException('missing_token');
    try {
      req.user = this.jwt.verify(token, { secret: process.env.JWT_SECRET || 'dev-secret' });
      return true;
    } catch {
      throw new UnauthorizedException('invalid_token');
    }
  }
}
