import { Inject, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { randomUUID } from 'crypto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { EventNotFoundException } from './events.exceptions';
import { UpdateEventDto } from './dto/update-event.dto';
import { events } from '@ticketbom/database';
import { TicketsService } from '../tickets/tickets.service';
import { IEventsRepository } from './events.repository';

@Injectable()
export class EventsService {
  constructor(
    @Inject(IEventsRepository) private eventsRepository: IEventsRepository,
    private ticketsService: TicketsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async create(createEventDto: CreateEventDto) {
    const event = await this.eventsRepository.withTransaction(async (tx) => {
      const result = await this.eventsRepository.create(
        {
          title: createEventDto.title,
          description: createEventDto.description,
          date: createEventDto.date,
          location: createEventDto.location,
          status: createEventDto.status,
          organizerId: randomUUID(),
        },
        tx
      );
      await this.cacheManager.del('events:*');

      return result;
    });

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const result = await this.eventsRepository.withTransaction(async (tx) => {
      const event = await this.eventsRepository.update(
        id,
        {
          title: updateEventDto.title,
          description: updateEventDto.description,
          date: updateEventDto.date,
          location: updateEventDto.location,
          status: updateEventDto.status,
        },
        tx
      );

      await this.cacheManager.del(`event:${id}`);
      await this.cacheManager.del('events:*');

      // TODO: Add log to track event updates
      return event;
    });

    return result;
  }

  async findAll({ page, pageSize } = { page: 1, pageSize: 10 }) {
    const cachedData = await this.cacheManager.get(
      `events:${page}:${pageSize}`
    );

    if (cachedData) return cachedData;

    const result = await this.eventsRepository.findWithPagination(
      {
        id: events.id,
        title: events.title,
        description: events.description,
        date: events.date,
        location: events.location,
        status: events.status,
      },
      page,
      pageSize
    );

    await this.cacheManager.set(`events:${page}:${pageSize}`, result);

    return result;
  }

  async findOne(id: string) {
    const cachedData = await this.cacheManager.get(`event:${id}`);
    if (cachedData) return cachedData;

    const event = await this.eventsRepository.findOneWithTickets(id);
    if (!event) throw new EventNotFoundException(id);

    await this.cacheManager.set(`event:${id}`, event);

    return event;
  }

  async findByOrganizerId(organizerId: string) {
    const cachedData = this.cacheManager.get(`events:organizer:${organizerId}`);
    if (cachedData) return cachedData;

    const event = await this.findByOrganizerId(organizerId);
    await this.cacheManager.set(`events:organizer:${organizerId}`, event);

    return event;
  }

  async findManyTicketsByEventId(eventId: string) {
    return this.ticketsService.findManyByEventId(eventId);
  }

  async remove(id: string) {
    await this.eventsRepository.delete(id);
  }
}
