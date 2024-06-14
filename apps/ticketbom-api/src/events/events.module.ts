import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { EventsRepository } from './events.repository';

@Module({
  controllers: [EventsController],
  providers: [EventsRepository, EventsService],
})
export class EventsModule {}
