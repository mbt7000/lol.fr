import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { WorkflowsService } from './workflows.service';

@ApiTags('workflows')
@Controller('orgs/:orgId/workflows')
@UseGuards(JwtAuthGuard, RbacGuard)
export class WorkflowsController {
  constructor(private readonly workflows: WorkflowsService) {}

  @Permissions('workflow.read')
  @Get()
  list(@Param('orgId') orgId: string) {
    return this.workflows.list(orgId);
  }

  @Permissions('workflow.write')
  @Post()
  create(@Param('orgId') orgId: string, @Body() body: { name: string; definition: unknown; enabled?: boolean }) {
    return this.workflows.create({ orgId, ...body });
  }

  @Permissions('workflow.run')
  @Post(':workflowId/run')
  run(@Param('orgId') orgId: string, @Param('workflowId') workflowId: string, @Body() body: { input?: unknown }) {
    return this.workflows.run({ orgId, workflowId, input: body.input });
  }

  @Permissions('workflow.read')
  @Get('runs/:runId/logs')
  logs(@Param('runId') runId: string) {
    return this.workflows.logs(runId);
  }
}
