import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { PrismaService } from '../../common/services/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  private digest(input: string) {
    return createHash('sha256').update(input).digest('hex');
  }

  async append(input: {
    orgId?: string;
    actorUserId?: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    payload?: unknown;
  }) {
    const prev = await this.prisma.auditLog.findFirst({ orderBy: { createdAt: 'desc' } });
    const prevHash = prev?.hash || 'GENESIS';
    const payload = JSON.stringify(input.payload || {});
    const hash = this.digest([prevHash, input.action, input.resourceType, input.resourceId || '', payload].join('|'));

    return this.prisma.auditLog.create({
      data: {
        orgId: input.orgId,
        actorUserId: input.actorUserId,
        action: input.action,
        resourceType: input.resourceType,
        resourceId: input.resourceId,
        payload: input.payload as object,
        hash,
      },
    });
  }

  async verifyChain(limit = 500) {
    const logs = await this.prisma.auditLog.findMany({ orderBy: { createdAt: 'asc' }, take: limit });
    let prevHash = 'GENESIS';
    for (const row of logs) {
      const payload = JSON.stringify(row.payload || {});
      const expected = this.digest([prevHash, row.action, row.resourceType, row.resourceId || '', payload].join('|'));
      if (expected !== row.hash) {
        return { ok: false, brokenAt: row.id, expected, actual: row.hash };
      }
      prevHash = row.hash;
    }
    return { ok: true, checked: logs.length };
  }

  async list(orgId?: string) {
    return this.prisma.auditLog.findMany({
      where: orgId ? { orgId } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
