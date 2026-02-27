import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { SearchService } from './search.service';

@ApiTags('search')
@Controller('orgs/:orgId/search')
@UseGuards(JwtAuthGuard, RbacGuard)
export class SearchController {
  constructor(private readonly search: SearchService) {}

  @Permissions('search.query')
  @Get()
  query(@Param('orgId') orgId: string, @Query('q') q = '') {
    return this.search.query(orgId, q);
  }

  @Permissions('search.index')
  @Post('index')
  index(
    @Param('orgId') orgId: string,
    @Body() body: { id: string; title: string; body: string },
  ) {
    return this.search.indexDocument({ ...body, orgId });
  }
}
