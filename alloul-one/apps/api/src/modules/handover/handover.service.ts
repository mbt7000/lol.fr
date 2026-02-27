import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';

@Injectable()
export class HandoverService {
  constructor(private readonly prisma: PrismaService) {}

  private score(total: number, done: number, hasRisks: boolean) {
    if (total === 0) return 0;
    const completion = (done / total) * 100;
    const riskPenalty = hasRisks ? 15 : 0;
    return Math.max(0, Math.min(100, Math.round(completion - riskPenalty)));
  }

  async list(orgId: string) {
    return this.prisma.handover.findMany({
      where: { orgId },
      include: { checklist: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async create(input: { orgId: string; ownerUserId: string; checklist?: string[]; risks?: string[] }) {
    const checklist = input.checklist || [];
    const risks = input.risks || [];
    const score = this.score(checklist.length, 0, risks.length > 0);

    return this.prisma.handover.create({
      data: {
        orgId: input.orgId,
        ownerUserId: input.ownerUserId,
        status: 'draft',
        score,
        report: {
          pendingRisks: risks,
          summary: 'Initial handover created',
        },
        checklist: {
          create: checklist.map((title) => ({ title, isDone: false })),
        },
      },
      include: { checklist: true },
    });
  }

  async toggleChecklistItem(input: { handoverId: string; itemId: string; isDone: boolean }) {
    await this.prisma.handoverChecklist.update({
      where: { id: input.itemId },
      data: { isDone: input.isDone },
    });

    const handover = await this.prisma.handover.findUnique({
      where: { id: input.handoverId },
      include: { checklist: true },
    });

    if (!handover) return null;

    const total = handover.checklist.length;
    const done = handover.checklist.filter((i) => i.isDone).length;
    const risks = ((handover.report as any)?.pendingRisks || []) as string[];
    const score = this.score(total, done, risks.length > 0);

    return this.prisma.handover.update({
      where: { id: input.handoverId },
      data: { score, status: done === total && total > 0 ? 'ready' : 'in_progress' },
      include: { checklist: true },
    });
  }

  async generateReport(handoverId: string) {
    const handover = await this.prisma.handover.findUnique({
      where: { id: handoverId },
      include: { checklist: true },
    });

    if (!handover) return null;

    const done = handover.checklist.filter((i) => i.isDone);
    const pending = handover.checklist.filter((i) => !i.isDone);
    const risks = ((handover.report as any)?.pendingRisks || []) as string[];

    const report = {
      handoverId,
      ownerUserId: handover.ownerUserId,
      status: handover.status,
      handoverScore: handover.score,
      completedItems: done.map((i) => i.title),
      pendingItems: pending.map((i) => i.title),
      pendingRisks: risks,
      aiExplanation:
        handover.score && handover.score >= 80
          ? 'Handover quality is strong. Minimal operational risk.'
          : 'Handover needs more completion before transfer.',
      generatedAt: new Date().toISOString(),
    };

    await this.prisma.handover.update({
      where: { id: handoverId },
      data: { report: report as any },
    });

    return report;
  }
}
