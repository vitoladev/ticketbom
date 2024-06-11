import { Inject, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@ticketbom/database';
import { randomUUID } from 'crypto';
import { eq, sql } from 'drizzle-orm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { EventAlreadyExistsException } from './events.exceptions';

@Injectable()
export class EventsService {
  constructor(
    @Inject('DB_DEV') private db: NodePgDatabase<typeof schema>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async create(createEventDto: CreateEventDto) {
    try {
      const event = await this.db
        .insert(schema.events)
        .values({
          title: createEventDto.title,
          description: createEventDto.description,
          date: createEventDto.date,
          location: createEventDto.location,
          status: createEventDto.status,
          organizerId: randomUUID(),
        })
        .returning()
        .then((event) => event[0]);

      await this.cacheManager.del('events:*');
      return event;
    } catch (error) {
      // TODO: Create a custom filter to handle conflict errors
      if (error.code === '23505') {
        throw new EventAlreadyExistsException(error);
      }
      throw error;
    }
  }

  async findAll({ page, pageSize } = { page: 1, pageSize: 10 }) {
    const cachedData = await this.cacheManager.get(
      `events:${page}:${pageSize}`
    );

    if (cachedData) return cachedData;

    const offset = (page - 1) * pageSize;

    const [data, [{ count }]] = await Promise.all([
      this.db
        .select({
          id: schema.events.id,
          title: schema.events.title,
          description: schema.events.description,
          date: schema.events.date,
          location: schema.events.location,
          status: schema.events.status,
        })
        .from(schema.events)
        .limit(pageSize)
        .offset(offset)
        .execute(),
      this.db
        .select({ count: sql<number>`CAST(COUNT(*) AS INTEGER)` })
        .from(schema.events)
        .execute(),
    ]);

    const totalPages = Math.ceil(count / pageSize);

    const result = {
      data,
      totalRecords: count,
      totalPages,
    };

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

    const event = await this.db.query.events.findFirst({
      where: eq(schema.events.id, id),
      with: {
        tickets: true,
      },
    });

    await this.cacheManager.set(`event:${id}`, event);

    return event;
  }

  async remove(id: string) {
    await this.db
      .delete(schema.events)
      .where(eq(schema.events.id, id))
      .execute();
  }
}
