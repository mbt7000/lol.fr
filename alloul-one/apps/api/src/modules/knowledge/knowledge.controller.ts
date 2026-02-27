import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { KnowledgeService } from './knowledge.service';

@ApiTags('knowledge')
@Controller('orgs/:orgId/knowledge')
@UseGuards(JwtAuthGuard, RbacGuard)
export class KnowledgeController {
  constructor(private readonly knowledge: KnowledgeService) {}

  @Permissions('knowledge.read')
  @Get('documents')
  list(@Param('orgId') orgId: string) {
    return this.knowledge.listDocuments(orgId);
  }

  @Permissions('knowledge.write')
  @Post('documents')
  create(
    @Param('orgId') orgId: string,
    @Body() body: { title: string; content: unknown; createdById: string },
  ) {
    return this.knowledge.createDocument({ orgId, ...body });
  }

  @Permissions('knowledge.write')
  @Post('documents/:documentId/versions')
  addVersion(
    @Param('documentId') documentId: string,
    @Body() body: { content: unknown; createdById: string },
  ) {
    return this.knowledge.addVersion({ documentId, ...body });
  }

  @Permissions('knowledge.approve')
  @Post('documents/:documentId/approvals')
  addApproval(
    @Param('documentId') documentId: string,
    @Body() body: { approverId: string; status: string },
  ) {
    return this.knowledge.addApproval({ documentId, ...body });
  }
}
