import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  async listSubscriptions(orgId?: string) {
    return this.prisma.subscription.findMany({
      where: orgId ? { orgId } : undefined,
      include: { invoices: true },
      orderBy: { startsAt: 'desc' },
      take: 100,
    });
  }

  async createSubscription(input: { orgId: string; tier: 'FREE' | 'PRO' | 'BUSINESS' | 'ENTERPRISE'; seats?: number; aiCredits?: number }) {
    return this.prisma.subscription.create({
      data: {
        orgId: input.orgId,
        tier: input.tier,
        seats: input.seats ?? 1,
        aiCredits: input.aiCredits ?? 0,
        startsAt: new Date(),
      },
    });
  }

  async createInvoice(input: { subscriptionId: string; amount: number; currency?: string }) {
    return this.prisma.invoice.create({
      data: {
        subscriptionId: input.subscriptionId,
        amount: input.amount,
        currency: input.currency || 'USD',
        status: 'OPEN',
        dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      },
    });
  }

  async stripeWebhook(event: any) {
    // M6 stub: ingest Stripe webhook and persist audit trail
    return { accepted: true, type: event?.type || 'unknown' };
  }
}
