import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  @Get('overview')
  overview() {
    return {
      companies: 0,
      activeUsers: 0,
      systemHealth: 'green',
      abuseFlags: 0,
    };
  }
}
