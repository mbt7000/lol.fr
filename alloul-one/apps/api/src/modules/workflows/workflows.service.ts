import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { OutboxService } from '../outbox/outbox.service';

@Injectable()
export class WorkflowsService {
  constructor(private readonly prisma: PrismaService, private readonly outbox: OutboxService) {}

  async list(orgId: string) {
    return this.prisma.workflow.findMany({ where: { orgId }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async create(input: { orgId: string; name: string; definition: unknown; enabled?: boolean }) {
    return this.prisma.workflow.create({
      data: {
        orgId: input.orgId,
        name: input.name,
        definition: input.definition as object,
        enabled: input.enabled ?? true,
      },
    });
  }

  async run(input: { orgId: string; workflowId: string; input?: unknown }) {
    const run = await this.prisma.workflowRun.create({
      data: {
        workflowId: input.workflowId,
        status: 'PENDING',
        input: (input.input || {}) as object,
      },
    });

    await this.outbox.enqueue('workflow.run.requested', {
      runId: run.id,
      workflowId: input.workflowId,
      orgId: input.orgId,
      input: input.input || {},
    }, input.orgId);

    return run;
  }

  async logs(runId: string) {
    return this.prisma.workflowLog.findMany({ where: { runId }, orderBy: { createdAt: 'asc' } });
  }
}
