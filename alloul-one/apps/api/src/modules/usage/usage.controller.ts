import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { UsageService } from './usage.service';

@ApiTags('usage')
@Controller('orgs/:orgId/usage')
@UseGuards(JwtAuthGuard, RbacGuard)
export class UsageController {
  constructor(private readonly usage: UsageService) {}

  @Permissions('usage.read')
  @Get()
  list(@Param('orgId') orgId: string) {
    return this.usage.list(orgId);
  }

  @Permissions('usage.write')
  @Post('increment')
  increment(@Param('orgId') orgId: string, @Body() body: { key: string; amount?: number }) {
    return this.usage.increment(orgId, body.key, body.amount ?? 1);
  }
}
