import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BillingService } from './billing.service';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly billing: BillingService) {}

  @Post('stripe')
  stripe(@Body() body: any) {
    return this.billing.stripeWebhook(body);
  }
}
