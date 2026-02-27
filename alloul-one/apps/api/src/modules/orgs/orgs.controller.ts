import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { OrgsService } from './orgs.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('orgs')
@Controller('orgs')
@UseGuards(JwtAuthGuard)
export class OrgsController {
  constructor(private readonly orgs: OrgsService) {}

  @UseGuards(RbacGuard)
  @Permissions('org.read')
  @Get()
  async list() {
    const data = await this.orgs.list();
    return { data, meta: { page: 1, pageSize: data.length, total: data.length } };
  }

  @UseGuards(RbacGuard)
  @Permissions('org.write')
  @Post()
  async create(@Body() body: { name: string; slug: string; locale?: string; timezone?: string }) {
    return this.orgs.create(body);
  }

  @Get(':orgId/projects')
  listProjects(@Param('orgId') orgId: string) {
    return { orgId, data: [] };
  }
}
