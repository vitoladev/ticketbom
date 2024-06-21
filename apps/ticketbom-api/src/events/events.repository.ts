import { Inject, Injectable } from '@nestjs/common';
import {
  BaseRepository,
  EventEntity,
  events,
  IRepository,
  DrizzleDatabase,
  TicketEntity,
  tables,
} from '@ticketbom/database';
import { eq } from 'drizzle-orm';

export interface IEventsRepository extends IRepository<typeof events._.config> {
  findOneWithTickets(
    id: string
  ): Promise<EventEntity & { tickets: TicketEntity[] }>;
  findManyByOrganizerId(organizerId: string): Promise<EventEntity[]>;
}

export const IEventsRepository = Symbol('IEventsRepository');

@Injectable()
class EventsRepository extends BaseRepository<typeof events._.config> {
  constructor(@Inject('DB_DEV') db: DrizzleDatabase) {
    super(db, 'events');
  }

  async findOneWithTickets(id: string): Promise<
    | (Pick<
        EventEntity,
        'id' | 'title' | 'description' | 'status' | 'location'
      > & {
        tickets: Pick<TicketEntity, 'id' | 'title' | 'price' | 'status'>[];
      })
    | null
  > {
    const rows = await this.db
      .select({
        id: events.id,
        title: events.title,
        description: events.description,
        date: events.date,
        location: events.location,
        status: events.status,
        tickets: {
          id: tables.tickets.id,
          title: tables.tickets.title,
          eventId: tables.tickets.eventId,
          price: tables.tickets.price,
          status: tables.tickets.status,
        },
      })
      .from(events)
      .where(eq(events.id, id))
      .fullJoin(tables.tickets, eq(tables.tickets.eventId, events.id));

    if (rows.length === 0) {
      return null;
    }

    const event = {
      id: rows[0].id,
      title: rows[0].title,
      description: rows[0].description,
      date: rows[0].date,
      location: rows[0].location,
      status: rows[0].status,
      tickets:
        rows[0]?.tickets?.id !== undefined
          ? rows.map((row) => ({
              id: row.tickets.id,
              title: row.tickets.title,
              price: row.tickets.price,
              status: row.tickets.status,
            }))
          : [],
    };

    return event;
  }

  async findManyByOrganizerId(organizerId: string): Promise<EventEntity[]> {
    return this.db.query.events.findMany({
      where: eq(events.organizerId, organizerId),
    });
  }
}

export const EventsRepositoryProvider = {
  provide: IEventsRepository,
  useClass: EventsRepository,
};
