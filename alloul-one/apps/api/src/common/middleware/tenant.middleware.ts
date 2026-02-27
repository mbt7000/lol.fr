import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request & { tenantId?: string }, _res: Response, next: NextFunction) {
    const tenantFromHeader = req.header('x-org-id');
    const tenantFromPath = req.path.split('/').find((s) => s.startsWith('org_'));
    req.tenantId = tenantFromHeader || tenantFromPath || undefined;
    next();
  }
}
