import { Module } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { WebhooksController } from './webhooks.controller';

@Module({
  controllers: [BillingController, WebhooksController],
  providers: [BillingService, PrismaService],
})
export class BillingModule {}
