import { Module } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { OutboxModule } from '../outbox/outbox.module';
import { WorkflowsController } from './workflows.controller';
import { WorkflowsService } from './workflows.service';

@Module({
  imports: [OutboxModule],
  controllers: [WorkflowsController],
  providers: [WorkflowsService, PrismaService],
})
export class WorkflowsModule {}
