import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { consumeToken } from '../security/rate-limit.store';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self';",
    );

    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown';
    const apiKey = (req.headers['x-api-key'] as string) || 'anonymous';

    const ipOk = consumeToken(`ip:${ip}`, 200, 5, 1);
    const keyOk = consumeToken(`key:${apiKey}`, 120, 3, 1);

    if (!ipOk || !keyOk) {
      res.status(429).json({ code: 'rate_limited', message: 'Too many requests' });
      return;
    }

    const len = Number(req.headers['content-length'] || 0);
    if (len > 5 * 1024 * 1024) {
      res.status(413).json({ code: 'payload_too_large', message: 'Request body too large' });
      return;
    }

    next();
  }
}
