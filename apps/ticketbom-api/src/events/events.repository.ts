import { Inject, Injectable } from '@nestjs/common';
import {
  BaseRepository,
  EventEntity,
  events,
  IRepository,
  DrizzleDatabase,
  TicketEntity,
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

  async findOneWithTickets(
    id: string
  ): Promise<EventEntity & { tickets: TicketEntity[] }> {
    return this.db.query.events.findFirst({
      where: eq(events.id, id),
      with: {
        tickets: true,
      },
    });
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
