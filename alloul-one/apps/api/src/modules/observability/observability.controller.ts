import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('observability')
@Controller('observability')
export class ObservabilityController {
  @Get('healthz')
  health() {
    return { status: 'ok', service: 'api', timestamp: new Date().toISOString() };
  }

  @Get('metrics')
  metrics() {
    return {
      requestCount: 0,
      errorRate: 0,
      p95Ms: 0,
      uptime: process.uptime(),
    };
  }
}
