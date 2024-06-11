import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzlePGModule } from '../common/drizzle/drizzle.module';
import * as schema from '@ticketbom/database';
import { UsersModule } from '../users/users.module';
import { EventsModule } from '../events/events.module';
import { TicketsModule } from '../tickets/tickets.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { validateEnvConfig } from '../common/config/env.validation';
import configuration from '../common/config/configuration';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validateEnvConfig,
      load: [configuration],
    }),
    DrizzlePGModule.register({
      tag: 'DB_DEV',
      pg: {
        connection: 'client',
        config: {
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT),
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        },
      },
      config: { schema: { ...schema } },
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    UsersModule,
    EventsModule,
    TicketsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_FILTER',
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
