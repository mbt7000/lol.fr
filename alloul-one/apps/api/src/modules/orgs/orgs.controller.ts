import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('orgs')
@Controller('orgs')
export class OrgsController {
  @Get()
  list() {
    return { data: [], meta: { page: 1, pageSize: 20, total: 0 } };
  }

  @Post()
  create(@Body() body: { name: string; slug: string }) {
    return { id: 'org_demo', ...body };
  }

  @Get(':orgId/projects')
  listProjects(@Param('orgId') orgId: string) {
    return { orgId, data: [] };
  }
}
