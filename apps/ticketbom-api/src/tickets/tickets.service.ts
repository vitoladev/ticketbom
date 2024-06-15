import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import {
  NodePgDatabase,
  NodePgQueryResultHKT,
} from 'drizzle-orm/node-postgres';
import * as schema from '@ticketbom/database';
import { eq, ExtractTablesWithRelations } from 'drizzle-orm';
import { PgTransaction } from 'drizzle-orm/pg-core';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { randomUUID } from 'crypto';

@Injectable()
export class TicketsService {
  constructor(
    @Inject('DB_DEV') private db: NodePgDatabase<typeof schema>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async create(createTicketDto: CreateTicketDto) {
    // TODO: Send to SQS to create a ticket

    return this.db.transaction(async (tx) => {
      const ticketId = randomUUID();

      // Create a ticket in the database
      const ticket = await tx
        .insert(schema.tickets)
        .values({
          id: ticketId,
          title: createTicketDto.title,
          status: 'AVAILABLE',
          price: createTicketDto.price,
          eventId: createTicketDto.eventId,
          quantityTotal: createTicketDto.quantityTotal,
          quantityAvailable: createTicketDto.quantityTotal,
        })
        .returning()
        .then((ticket) => ticket[0]);

      // Save ticket to cache
      await this.cacheManager.set(`ticket:${ticket.id}`, ticket);

      return ticket;
    });
  }

  async verifyIfTicketIsAvailable(
    id: string,
    tx?: PgTransaction<
      NodePgQueryResultHKT,
      any,
      ExtractTablesWithRelations<any>
    >
  ) {
    const db = tx ?? this.db;
    const ticket = await db
      .select()
      .from(schema.tickets)
      .where(eq(schema.tickets.id, id))
      .then((tickets) => tickets[0]);
    // Check if the ticket is sold out
    // If the ticket is sold out, throw an error
    if (ticket.quantityAvailable === 0 || ticket.status === 'SOLD_OUT') {
      throw new BadRequestException('Ticket is sold out');
    }

    return ticket;
  }

  // select all tickets for an event by event id
  async findByEventId(eventId: string) {
    const ticket = await this.db
      .select()
      .from(schema.tickets)
      .where(eq(schema.tickets.eventId, eventId))
      .execute();

    return ticket;
  }

  async findOne(id: string) {
    const ticket = await this.db
      .select()
      .from(schema.tickets)
      .where(eq(schema.tickets.id, id))
      .execute()
      .then((tickets) => tickets[0]);
    // Save ticket to cache

    return ticket;
  }

  async remove(id: string) {
    await this.db
      .delete(schema.tickets)
      .where(eq(schema.tickets.id, id))
      .execute();
  }
}
