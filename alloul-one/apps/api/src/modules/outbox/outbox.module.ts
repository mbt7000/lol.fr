import { Module } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { OutboxService } from './outbox.service';

@Module({
  providers: [OutboxService, PrismaService],
  exports: [OutboxService],
})
export class OutboxModule {}
