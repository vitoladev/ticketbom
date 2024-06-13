import { Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client, Pool } from 'pg';
import { DrizzlePGConfig } from './drizzle.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DrizzlePGService {
  constructor(private readonly configService: ConfigService) {}

  public async getDrizzle(options: DrizzlePGConfig) {
    const config = this.configService.get('database');

    if (options.connection === 'client') {
      const client = new Client(config);
      await client.connect();
      return drizzle(client, options?.config);
    }
    const pool = new Pool(config);
    return drizzle(pool, options?.config);
  }
}
