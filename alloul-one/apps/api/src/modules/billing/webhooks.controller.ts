import { Body, Controller, Headers, Post, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { createHmac, timingSafeEqual } from 'crypto';
import { checkAndMarkIdempotency } from '../../common/security/rate-limit.store';
import { BillingService } from './billing.service';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly billing: BillingService) {}

  @Post('stripe')
  stripe(@Body() body: any, @Headers('stripe-signature') sig?: string, @Headers('idempotency-key') idem?: string) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET || '';
    const payload = JSON.stringify(body || {});
    const expected = createHmac('sha256', secret).update(payload).digest('hex');

    if (!sig || !secret) throw new UnauthorizedException('missing_webhook_signature_setup');

    const valid = sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
    if (!valid) throw new UnauthorizedException('invalid_webhook_signature');

    if (idem && !checkAndMarkIdempotency(`webhook:stripe:${idem}`, 60 * 60 * 1000)) {
      return { accepted: true, duplicate: true };
    }

    return this.billing.stripeWebhook(body);
  }
}
