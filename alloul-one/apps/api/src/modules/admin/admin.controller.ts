import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { createHash } from 'crypto';
import { PrismaService } from '../../common/services/prisma.service';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('overview')
  async overview() {
    const prev = await this.prisma.auditLog.findFirst({ orderBy: { createdAt: 'desc' } });
    const prevHash = prev?.hash || 'GENESIS';
    const hash = createHash('sha256')
      .update([prevHash, 'admin.read', 'admin.overview', '', '{}'].join('|'))
      .digest('hex');

    await this.prisma.auditLog.create({
      data: {
        action: 'admin.read',
        resourceType: 'admin.overview',
        hash,
        payload: {},
      },
    });

    return {
      companies: 0,
      activeUsers: 0,
      systemHealth: 'green',
      abuseFlags: 0,
    };
  }
}
