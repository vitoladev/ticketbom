import { Inject, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@ticketbom/database';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { EventNotFoundException } from './events.exceptions';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsRepository } from './events.repository';

@Injectable()
export class EventsService {
  constructor(
    @Inject('DB_DEV') private db: NodePgDatabase<typeof schema>,
    private eventsRepository: EventsRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async create(createEventDto: CreateEventDto) {
    const event = this.eventsRepository.withTransaction(async (tx) => {
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
    const result = await this.db.transaction(async (tx) => {
      const event = tx
        .update(schema.events)
        .set({
          title: updateEventDto.title,
          description: updateEventDto.description,
          date: updateEventDto.date,
          location: updateEventDto.location,
          status: updateEventDto.status,
        })
        .where(eq(schema.events.id, id))
        .returning()
        .then((event) => event[0]);

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

    const offset = (page - 1) * pageSize;

    const result = await this.eventsRepository.findWithPagination(
      {
        id: schema.events.id,
        title: schema.events.title,
        description: schema.events.description,
        date: schema.events.date,
        location: schema.events.location,
        status: schema.events.status,
      },
      offset,
      pageSize
    );

    await this.cacheManager.set(`events:${page}:${pageSize}`, result);

    return result;
  }

  async findByOrganizerId(organizerId: string) {
    const cachedData = this.cacheManager.get(`events:organizer:${organizerId}`);
    if (cachedData) return cachedData;

    const event = await this.db.query.events.findMany({
      where: eq(schema.events.organizerId, organizerId),
    });

    await this.cacheManager.set(`events:organizer:${organizerId}`, event);

    return;
  }

  async findOne(id: string) {
    const cachedData = await this.cacheManager.get(`event:${id}`);
    if (cachedData) return cachedData;

    const event = await this.eventsRepository.findOneWithTickets(id);

    if (!event) throw new EventNotFoundException(id);

    await this.cacheManager.set(`event:${id}`, event);

    return event;
  }

  async remove(id: string) {
    await this.eventsRepository.delete(id);
  }
}
