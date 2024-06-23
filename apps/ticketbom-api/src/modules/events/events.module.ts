import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { EventsRepositoryProvider } from './events.repository';
import { TicketsModule } from '@modules/tickets/tickets.module';
import { CacheModule } from '@nestjs/cache-manager';
import { TicketsRepositoryProvider } from '@modules/tickets/tickets.repository';
import { TicketsService } from '@modules/tickets/tickets.service';

@Module({
  imports: [CacheModule.register(), TicketsModule],
  controllers: [EventsController],
  providers: [
    TicketsRepositoryProvider,
    TicketsService,
    EventsRepositoryProvider,
    EventsService,
  ],
})
export class EventsModule {}
