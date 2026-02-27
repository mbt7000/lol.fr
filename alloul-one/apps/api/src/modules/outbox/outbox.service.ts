import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';

@Injectable()
export class OutboxService {
  constructor(private readonly prisma: PrismaService) {}

  async enqueue(topic: string, payload: unknown, orgId?: string) {
    return this.prisma.eventOutbox.create({
      data: {
        orgId,
        topic,
        payload: payload as object,
        status: 'PENDING',
      },
    });
  }

  async claimBatch(limit = 50) {
    const rows = await this.prisma.eventOutbox.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
    return rows;
  }

  async markProcessed(id: string) {
    return this.prisma.eventOutbox.update({
      where: { id },
      data: { status: 'PROCESSED', processedAt: new Date() },
    });
  }
}
