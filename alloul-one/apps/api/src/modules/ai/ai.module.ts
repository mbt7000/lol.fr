import { Module } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { UsageModule } from '../usage/usage.module';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [UsageModule],
  controllers: [AiController],
  providers: [AiService, PrismaService],
})
export class AiModule {}
