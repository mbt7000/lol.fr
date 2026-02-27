import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';

@Injectable()
export class KnowledgeService {
  constructor(private readonly prisma: PrismaService) {}

  async listDocuments(orgId: string) {
    return this.prisma.document.findMany({
      where: { orgId },
      include: { versions: true, approvals: true },
      orderBy: { updatedAt: 'desc' },
      take: 50,
    });
  }

  async createDocument(input: { orgId: string; title: string; content: unknown; createdById: string }) {
    return this.prisma.document.create({
      data: {
        orgId: input.orgId,
        title: input.title,
        createdById: input.createdById,
        versions: {
          create: [{ content: input.content as object, version: 1, createdById: input.createdById }],
        },
      },
      include: { versions: true },
    });
  }

  async addVersion(input: { documentId: string; content: unknown; createdById: string }) {
    const latest = await this.prisma.documentVersion.findFirst({
      where: { documentId: input.documentId },
      orderBy: { version: 'desc' },
    });

    const version = (latest?.version || 0) + 1;
    return this.prisma.documentVersion.create({
      data: {
        documentId: input.documentId,
        content: input.content as object,
        version,
        createdById: input.createdById,
      },
    });
  }

  async addApproval(input: { documentId: string; approverId: string; status: string }) {
    return this.prisma.documentApproval.create({
      data: input,
    });
  }
}
