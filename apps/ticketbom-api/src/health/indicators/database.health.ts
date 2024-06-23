import { Inject, Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { DrizzleDatabase, pingDrizzleDb } from '@ticketbom/database';

@Injectable()
export class DatabaseHealthIndicator extends HealthIndicator {
  constructor(@Inject(DrizzleDatabase) private db: DrizzleDatabase) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const ping = await pingDrizzleDb(this.db);
    const isHealthy = ping.status === 'ok';
    const result = this.getStatus(key, isHealthy, { status: 'up' });

    if (isHealthy) {
      return result;
    }

    throw new HealthCheckError('DB is not healthy', result);
  }
}
