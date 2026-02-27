import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';

@Injectable()
export class UsageService {
  constructor(private readonly prisma: PrismaService) {}

  async increment(orgId: string, key: string, amount = 1) {
    const now = new Date();
    const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const periodEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

    const existing = await this.prisma.usageMeter.findFirst({ where: { orgId, key, periodStart, periodEnd } });
    if (!existing) {
      return this.prisma.usageMeter.create({ data: { orgId, key, value: amount, periodStart, periodEnd } });
    }

    return this.prisma.usageMeter.update({ where: { id: existing.id }, data: { value: existing.value + amount } });
  }

  async list(orgId: string) {
    return this.prisma.usageMeter.findMany({ where: { orgId }, orderBy: { periodStart: 'desc' }, take: 50 });
  }
}
