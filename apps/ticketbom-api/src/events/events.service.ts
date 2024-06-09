import { Inject, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@ticketbom/database';
import { randomUUID } from 'crypto';
import { eq, sql } from 'drizzle-orm';

@Injectable()
export class EventsService {
  constructor(@Inject('DB_DEV') private db: NodePgDatabase<typeof schema>) {}

  async create(createEventDto: CreateEventDto) {
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

    return event;
  }

  // Search for all events in the database with pagination support using the page and pageSize query parameters from the request
  async findAll({ page, pageSize } = { page: 1, pageSize: 10 }) {
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

    return {
      data,
      totalRecords: count,
      totalPages,
    };
  }

  async findOne(id: string) {
    const event = await this.db.query.events.findMany({
      where: eq(schema.events.id, id),
      with: {
        tickets: {
          where: eq(schema.tickets.eventId, id),
        },
      },
    });

    return event;
  }

  async remove(id: string) {
    await this.db
      .delete(schema.events)
      .where(eq(schema.events.id, id))
      .execute();
  }
}
