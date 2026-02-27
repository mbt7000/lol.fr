import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@ApiTags('rbac')
@Controller('rbac')
export class RbacController {
  @UseGuards(RbacGuard)
  @Permissions('rbac.read')
  @Get('permissions')
  permissions() {
    return { data: ['org.read', 'org.write', 'project.write', 'billing.read'] };
  }
}
