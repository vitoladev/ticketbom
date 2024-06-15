import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaymentsService } from '../payments/payments.service';
import { randomUUID } from 'crypto';
import { tickets } from '@ticketbom/database';
import { sql } from 'drizzle-orm';

@Injectable()
export class OrdersService {
  constructor(
    private ordersRepository: OrdersRepository,
    private paymentGateway: PaymentsService
  ) {}

  async start(createOrderDto: CreateOrderDto) {
    await this.ordersRepository.withTransaction(async (tx) => {
      const selectedTickets = await tx
        .select()
        .from(tickets)
        .where(sql`id IN (${createOrderDto.tickets.map((t) => t.ticketId)})`)
        .execute();

      const orderedTickets = selectedTickets.map((ticket) => {
        const selectedTicket = createOrderDto.tickets.find(
          (t) => t.ticketId === ticket.id
        );

        return {
          id: ticket.id,
          title: ticket.title,
          price: ticket.price,
          quantity: selectedTicket.quantity,
        };
      });

      const orderId = randomUUID();
      const paymentIntent = await this.paymentGateway.createPaymentIntent({
        items: orderedTickets,
      });

      const order = this.ordersRepository.startOrder(
        {
          id: orderId,
          ...createOrderDto,
          paymentIntentId: paymentIntent.id,
        },
        tx
      );

      return order;
    });
  }

  async complete(completeOrderDto: {
    id: string;
    status: 'PAID' | 'REFUNDED';
  }) {
    await this.ordersRepository.withTransaction(async (tx) => {
      return this.ordersRepository.changeStatus(
        {
          id: completeOrderDto.id,
          status: completeOrderDto.status,
          currentStatus: 'RESERVED',
        },
        tx
      );
    });
  }
}
