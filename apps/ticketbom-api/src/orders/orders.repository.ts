import { Inject, Injectable } from '@nestjs/common';
import * as schema from '@ticketbom/database';
import {
  BaseRepository,
  DrizzleTransactionScope,
  ticketOrderDetails,
  ticketOrders,
  tickets,
} from '@ticketbom/database';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { CreateOrderDto } from './dto/create-order.dto';
import { addMinutes } from 'date-fns';
import { and, eq, sql } from 'drizzle-orm';

@Injectable()
export class OrdersRepository extends BaseRepository<
  typeof ticketOrders._.config
> {
  constructor(@Inject('DB_DEV') db: NodePgDatabase<typeof schema>) {
    super(db, 'ticket_orders');
  }

  async startOrder(
    dto: CreateOrderDto & { id: string; paymentIntentId: string },
    tx: DrizzleTransactionScope
  ) {
    const order = await this.create(
      {
        id: dto.id,
        userId: dto.userId,
        paymentIntentId: dto.paymentIntentId,
        expiresAt: addMinutes(new Date(), 15).toISOString(),
        status: 'RESERVED',
      },
      tx
    );

    const ticketDetails = dto.tickets.map((dto) => ({
      ticketOrderId: order.id,
      ticketId: dto.ticketId,
      quantity: dto.quantity,
    }));

    const orderDetails = await tx
      .insert(ticketOrderDetails)
      .values(ticketDetails)
      .returning()
      .execute();

    for (const detail of orderDetails) {
      await tx
        .update(tickets)
        .set({
          quantityAvailable: sql`${tickets.quantityAvailable} - ${detail.quantity}`,
          quantityReserved: sql`${tickets.quantityReserved} + ${detail.quantity}`,
        })
        .where(eq(schema.tickets.id, detail.ticketId))
        .execute();
    }

    return {
      ...order,
      details: orderDetails,
    };
  }

  async changeStatus(
    {
      id,
      status,
      currentStatus,
    }: {
      id: string;
      status: 'RESERVED' | 'PAID' | 'PENDING' | 'REFUNDED';
      currentStatus?: 'RESERVED' | 'PAID' | 'PENDING' | 'REFUNDED';
    },
    tx?: DrizzleTransactionScope
  ) {
    const dbScope = tx || this.db;
    const whereClause = currentStatus
      ? and(eq(ticketOrders.id, id), eq(ticketOrders.status, currentStatus))
      : eq(ticketOrders.id, id);

    const order = await dbScope
      .update(ticketOrders)
      .set({
        status,
      })
      .where(whereClause)
      .returning()
      .then((order) => order[0]);

    if (!order) {
      return null;
    }

    return order;
  }
}
