import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { AuditService } from './audit.service';

@ApiTags('audit')
@Controller('audit')
@UseGuards(JwtAuthGuard, RbacGuard)
export class AuditController {
  constructor(private readonly audit: AuditService) {}

  @Permissions('audit.read')
  @Get('logs')
  logs(@Query('orgId') orgId?: string) {
    return this.audit.list(orgId);
  }

  @Permissions('audit.write')
  @Post('logs')
  write(@Body() body: { orgId?: string; actorUserId?: string; action: string; resourceType: string; resourceId?: string; payload?: unknown }) {
    return this.audit.append(body);
  }

  @Permissions('audit.verify')
  @Get('verify')
  verify(@Query('limit') limit = '500') {
    return this.audit.verifyChain(Number(limit));
  }

  @Permissions('audit.read')
  @Get('org/:orgId')
  orgLogs(@Param('orgId') orgId: string) {
    return this.audit.list(orgId);
  }
}
