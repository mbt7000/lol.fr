import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) || [];

    if (!required.length) return true;
    const req = context.switchToHttp().getRequest();
    const raw = (req.header('x-permissions') || '') as string;
    const granted = raw.split(',').map((p) => p.trim()).filter(Boolean);
    return required.every((p) => granted.includes(p));
  }
}
