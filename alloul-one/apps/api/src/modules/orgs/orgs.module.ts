import { Module } from '@nestjs/common';
import { OrgsController } from './orgs.controller';
import { OrgsService } from './orgs.service';
import { PrismaService } from '../../common/services/prisma.service';

@Module({
  controllers: [OrgsController],
  providers: [OrgsService, PrismaService],
})
export class OrgsModule {}
