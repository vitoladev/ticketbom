import { Module } from '@nestjs/common';

import { DrizzlePGModule } from '@common/drizzle/drizzle.module';
import { UsersModule } from '@modules/users/users.module';
import { EventsModule } from '@modules/events/events.module';
import { TicketsModule } from '@modules/tickets/tickets.module';
import { ConfigModule } from '@nestjs/config';
import { configurationFn, validateEnvConfig } from '@common/config';
import { CatchAllExceptionFilter } from '@common/filters/catch-all-exception.filter';
import { HealthModule } from './health/health.module';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import { DrizzleDatabase } from '@ticketbom/database';

@Module({
  imports: [
    GracefulShutdownModule.forRoot(),
    ConfigModule.forRoot({
      validate: validateEnvConfig,
      load: [configurationFn],
      isGlobal: true,
    }),
    HealthModule,
    DrizzlePGModule.registerAsync({
      tag: DrizzleDatabase,
      useFactory: () => ({
        connection: 'client',
      }),
    }),
    UsersModule,
    TicketsModule,
    EventsModule,
  ],
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: CatchAllExceptionFilter,
    },
  ],
})
export class AppModule {}
