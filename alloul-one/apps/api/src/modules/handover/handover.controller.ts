import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { HandoverService } from './handover.service';

@ApiTags('handover')
@Controller('orgs/:orgId/handover')
@UseGuards(JwtAuthGuard, RbacGuard)
export class HandoverController {
  constructor(private readonly handover: HandoverService) {}

  @Permissions('handover.read')
  @Get()
  list(@Param('orgId') orgId: string) {
    return this.handover.list(orgId);
  }

  @Permissions('handover.write')
  @Post()
  create(
    @Param('orgId') orgId: string,
    @Body() body: { ownerUserId: string; checklist?: string[]; risks?: string[] },
  ) {
    return this.handover.create({ orgId, ...body });
  }

  @Permissions('handover.write')
  @Patch(':handoverId/checklist/:itemId')
  toggleItem(
    @Param('handoverId') handoverId: string,
    @Param('itemId') itemId: string,
    @Body() body: { isDone: boolean },
  ) {
    return this.handover.toggleChecklistItem({ handoverId, itemId, isDone: body.isDone });
  }

  @Permissions('handover.read')
  @Post(':handoverId/report')
  report(@Param('handoverId') handoverId: string) {
    return this.handover.generateReport(handoverId);
  }
}
