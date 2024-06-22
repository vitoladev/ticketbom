import { TicketsRepositoryProvider } from '../tickets/tickets.repository';
import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TicketsService } from '../tickets/tickets.service';
import { EventsRepositoryProvider } from './events.repository';

@Module({
  controllers: [EventsController],
  providers: [
    TicketsRepositoryProvider,
    TicketsService,
    EventsRepositoryProvider,
    EventsService,
  ],
})
export class EventsModule {}
