import { Inject, Injectable } from '@nestjs/common';
import * as schema from '@ticketbom/database';
import {
  BaseRepository,
  EventEntity,
  events,
  TicketEntity,
} from '@ticketbom/database';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';

@Injectable()
export class EventsRepository extends BaseRepository<typeof events._.config> {
  constructor(@Inject('DB_DEV') db: NodePgDatabase<typeof schema>) {
    super(db, 'events');
  }

  async findOneWithTickets(
    id: string
  ): Promise<EventEntity & { tickets: TicketEntity[] }> {
    return this.db.query.events.findFirst({
      where: eq(schema.events.id, id),
      with: {
        tickets: true,
      },
    });
  }
}
