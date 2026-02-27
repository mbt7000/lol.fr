import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { BillingService } from './billing.service';

@ApiTags('billing')
@Controller('billing')
@UseGuards(JwtAuthGuard, RbacGuard)
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  @Permissions('billing.read')
  @Get('subscriptions')
  listSubscriptions(@Query('orgId') orgId?: string) {
    return this.billing.listSubscriptions(orgId);
  }

  @Permissions('billing.write')
  @Post('subscriptions')
  createSubscription(@Body() body: { orgId: string; tier: 'FREE' | 'PRO' | 'BUSINESS' | 'ENTERPRISE'; seats?: number; aiCredits?: number }) {
    return this.billing.createSubscription(body);
  }

  @Permissions('billing.write')
  @Post('invoices')
  createInvoice(@Body() body: { subscriptionId: string; amount: number; currency?: string }) {
    return this.billing.createInvoice(body);
  }

}
