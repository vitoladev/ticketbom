import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client, Pool } from 'pg';
import { tables } from '@ticketbom/database';
import { DrizzlePGConfig } from './drizzle.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DrizzlePGService implements OnApplicationShutdown {
  constructor(private readonly configService: ConfigService) {}
  databaseInstance?: Client | Pool;

  onApplicationShutdown(signal?: string) {
    Logger.log('Shutting down drizzle: ' + signal);
    if (signal === 'SIGINT' || signal === 'SIGTERM') {
      this.databaseInstance?.end((err) => {
        if (err) {
          Logger.error('Error shutting down drizzle: ' + err);
        }
        Logger.log('Drizzle shut down');
      });
    }
  }

  public async getDrizzle(options: DrizzlePGConfig) {
    const config = this.configService.get('database');

    if (options.connection === 'client') {
      this.databaseInstance = new Client(config);
      await this.databaseInstance.connect();
      return drizzle(this.databaseInstance, {
        schema: { ...tables },
      });
    }

    this.databaseInstance = new Pool(config);
    return drizzle(this.databaseInstance, {
      schema: { ...tables },
    });
  }
}
