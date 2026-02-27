import { Module } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { HandoverController } from './handover.controller';
import { HandoverService } from './handover.service';

@Module({
  controllers: [HandoverController],
  providers: [HandoverService, PrismaService],
})
export class HandoverModule {}
