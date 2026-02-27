import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RbacGuard } from '../../common/guards/rbac.guard';

@ApiTags('rbac')
@Controller('rbac')
export class RbacController {
  @UseGuards(RbacGuard)
  @Get('permissions')
  permissions() {
    return { data: ['org.read', 'project.write', 'billing.read'] };
  }
}
