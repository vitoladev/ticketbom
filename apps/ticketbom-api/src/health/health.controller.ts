import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { Get, Controller } from '@nestjs/common';
import { DatabaseHealthIndicator } from './indicators/database.health';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private dbHealthIndicator: DatabaseHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  healthCheck() {
    return this.health.check([() => this.dbHealthIndicator.isHealthy('db')]);
  }
}
