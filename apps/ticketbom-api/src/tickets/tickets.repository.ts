import { Inject, Injectable } from '@nestjs/common';
import {
  DrizzleDatabase,
  IRepository,
  TicketEntity,
} from '@ticketbom/database';
import { BaseRepository, tickets } from '@ticketbom/database';
import { eq } from 'drizzle-orm';

export interface ITicketsRepository
  extends IRepository<typeof tickets._.config> {
  findByEventId(eventId: string): Promise<TicketEntity>;
}

export const ITicketsRepository = Symbol('ITicketsRepository');

@Injectable()
class TicketsRepository extends BaseRepository<typeof tickets._.config> {
  constructor(@Inject('DB_DEV') db: DrizzleDatabase) {
    super(db, 'tickets');
  }

  async findByEventId(eventId: string) {
    const ticket = await this.db
      .select()
      .from(tickets)
      .where(eq(tickets.eventId, eventId))
      .execute();

    return ticket;
  }
}

export const TicketsRepositoryProvider = {
  provide: ITicketsRepository,
  useClass: TicketsRepository,
};
