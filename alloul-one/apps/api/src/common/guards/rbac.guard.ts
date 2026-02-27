import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RbacGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    if (!req?.user) return true; // placeholder until auth wired
    return true;
  }
}
