import { Inject, Injectable } from '@nestjs/common';
import {
  DrizzleDatabase,
  DrizzleTransactionScope,
  IRepository,
  TicketEntity,
} from '@ticketbom/database';
import { BaseRepository, tickets as ticketsTable } from '@ticketbom/database';
import { eq, inArray, sql } from 'drizzle-orm';

export interface ITicketsRepository
  extends IRepository<typeof ticketsTable._.config> {
  updateTicketQuantityAction(
    {
      ticketId,
      action,
      quantity,
    }: {
      ticketId: string;
      action: 'RESERVE' | 'RELEASE';
      quantity: number;
    },
    tx?: DrizzleTransactionScope
  ): Promise<void>;
  findByEventId(eventId: string): Promise<TicketEntity>;
  findByIds(
    ids: string[],
    tx?: DrizzleTransactionScope
  ): Promise<TicketEntity[]>;
}

export const ITicketsRepository = Symbol('ITicketsRepository');

@Injectable()
class TicketsRepository
  extends BaseRepository<typeof ticketsTable._.config>
  implements ITicketsRepository
{
  constructor(@Inject('DB_DEV') db: DrizzleDatabase) {
    super(db, 'tickets');
  }

  async updateTicketQuantityAction(
    {
      ticketId,
      quantity,
      action,
    }: {
      ticketId: string;
      quantity: number;
      action: 'RESERVE' | 'RELEASE';
    },
    transactionScope?: DrizzleTransactionScope
  ): Promise<void> {
    const quantityActions = {
      RESERVE: {
        quantityAvailable: sql`${ticketsTable.quantityAvailable} - ${quantity}`,
        quantityReserved: sql`${ticketsTable.quantityReserved} + ${quantity}`,
      },
      RELEASE: {
        quantityAvailable: sql`${ticketsTable.quantityAvailable} + ${quantity}`,
        quantityReserved: sql`${ticketsTable.quantityReserved} - ${quantity}`,
      },
    };

    const quantityAction = quantityActions[action];

    await this.update(
      ticketId,
      {
        quantityAvailable: quantityAction.quantityAvailable,
        quantityReserved: quantityAction.quantityReserved,
      },
      transactionScope
    );
  }

  async findByEventId(eventId: string): Promise<TicketEntity> {
    const ticket = await this.db
      .select()
      .from(ticketsTable)
      .where(eq(ticketsTable.eventId, eventId))
      .execute()
      .then((res) => res[0]);

    return ticket;
  }

  async findByIds(ids: string[], tx?: DrizzleTransactionScope) {
    const tickets = await tx
      .select()
      .from(ticketsTable)
      .where(inArray(ticketsTable.id, ids))
      .execute();

    return tickets;
  }
}

export const TicketsRepositoryProvider = {
  provide: ITicketsRepository,
  useClass: TicketsRepository,
};
