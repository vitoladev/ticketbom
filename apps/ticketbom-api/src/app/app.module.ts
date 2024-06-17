import { Module } from '@nestjs/common';

import { DrizzlePGModule } from '../common/drizzle/drizzle.module';
import { UsersModule } from '../users/users.module';
import { EventsModule } from '../events/events.module';
import { TicketsModule } from '../tickets/tickets.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { validateEnvConfig } from '../common/config/env.validation';
import configuration from '../common/config/configuration';
import { CatchAllExceptionFilter } from '../common/filters/catch-all-exception.filter';
import { HealthModule } from '../health/health.module';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';

@Module({
  imports: [
    GracefulShutdownModule.forRoot(),
    ConfigModule.forRoot({
      validate: validateEnvConfig,
      load: [configuration],
      isGlobal: true,
    }),
    HealthModule,
    DrizzlePGModule.registerAsync({
      tag: 'DB_DEV',
      useFactory: () => ({
        connection: 'client',
      }),
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    UsersModule,
    EventsModule,
    TicketsModule,
  ],
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: CatchAllExceptionFilter,
    },
  ],
})
export class AppModule {}
