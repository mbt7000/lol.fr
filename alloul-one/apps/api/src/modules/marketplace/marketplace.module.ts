import { Module } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceService } from './marketplace.service';

@Module({
  controllers: [MarketplaceController],
  providers: [MarketplaceService, PrismaService],
})
export class MarketplaceModule {}
