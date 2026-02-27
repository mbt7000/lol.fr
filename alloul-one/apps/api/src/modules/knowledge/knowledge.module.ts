import { Module } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { KnowledgeController } from './knowledge.controller';
import { KnowledgeService } from './knowledge.service';

@Module({
  controllers: [KnowledgeController],
  providers: [KnowledgeService, PrismaService],
})
export class KnowledgeModule {}
