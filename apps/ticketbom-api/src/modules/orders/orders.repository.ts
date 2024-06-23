import { Inject, Injectable } from '@nestjs/common';
import {
  BaseRepository,
  DrizzleTransactionScope,
  DrizzleDatabase,
  ticketOrderDetails,
  ticketOrders,
  IRepository,
  TicketOrderEntity,
  TicketOrderDetailEntity,
} from '@ticketbom/database';
import { CreateOrderDto } from './dto/create-order.dto';
import { and, eq } from 'drizzle-orm';

type OrderStatus = 'RESERVED' | 'PAID' | 'PENDING' | 'REFUNDED';

type ChangeStatusParams = {
  id: string;
  status: OrderStatus;
  currentStatus?: OrderStatus;
};

export interface IOrdersRepository
  extends IRepository<typeof ticketOrders._.config> {
  createOrderDetails(
    {
      orderId,
      tickets,
    }: {
      orderId: string;
      tickets: CreateOrderDto['tickets'];
    },
    transactionScope: DrizzleTransactionScope
  ): Promise<TicketOrderDetailEntity[]>;

  changeStatus(
    { id, status, currentStatus }: ChangeStatusParams,
    tx?: DrizzleTransactionScope
  ): Promise<TicketOrderEntity>;
}

export const IOrdersRepository = Symbol('IOrdersRepository');

@Injectable()
export class OrdersRepository
  extends BaseRepository<typeof ticketOrders._.config>
  implements IOrdersRepository
{
  constructor(@Inject(DrizzleDatabase) db: DrizzleDatabase) {
    super(db, 'ticket_orders');
  }

  async createOrderDetails(
    {
      orderId,
      tickets,
    }: {
      orderId: string;
      tickets: CreateOrderDto['tickets'];
    },
    transactionScope: DrizzleTransactionScope
  ) {
    const ticketDetails = tickets.map((ticket) => ({
      ticketOrderId: orderId,
      ticketId: ticket.ticketId,
      quantity: ticket.quantity,
    }));

    const orderDetails = await transactionScope
      .insert(ticketOrderDetails)
      .values(ticketDetails)
      .returning()
      .execute();

    return orderDetails;
  }

  async changeStatus(
    { id, status, currentStatus }: ChangeStatusParams,
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

export const OrdersRepositoryProvider = {
  provide: IOrdersRepository,
  useClass: OrdersRepository,
};
