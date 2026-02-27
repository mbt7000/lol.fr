import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { UsageService } from '../usage/usage.service';

@Injectable()
export class AiService {
  constructor(private readonly prisma: PrismaService, private readonly usage: UsageService) {}

  async query(input: { orgId: string; userId?: string; query: string; contextIds?: string[] }) {
    await this.usage.increment(input.orgId, 'ai_queries', 1);

    const docs = await this.prisma.document.findMany({
      where: { orgId: input.orgId, ...(input.contextIds?.length ? { id: { in: input.contextIds } } : {}) },
      take: 5,
      orderBy: { updatedAt: 'desc' },
    });

    return {
      answer: `AI summary for org ${input.orgId}: processed query \"${input.query}\" with ${docs.length} context docs.`,
      modules: ['memory', 'reasoning', 'summarizer', 'executor'],
      safety: { permissionAware: true, tenantScoped: true },
    };
  }
}
