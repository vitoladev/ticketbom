import { Inject, Injectable } from '@nestjs/common';
import { IOrdersRepository } from './orders.repository';
import { CreateOrderDto, TicketOrderDto } from './dto/create-order.dto';
import { PaymentsService } from '../payments/payments.service';
import { randomUUID } from 'crypto';
import {
  DrizzleTransactionScope,
} from '@ticketbom/database';
import { TicketsService } from '../tickets/tickets.service';
import { addMinutes } from 'date-fns';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(IOrdersRepository) private ordersRepository: IOrdersRepository,
    private ticketsService: TicketsService,
    private paymentGatewayService: PaymentsService
  ) {}

  async sendOrderPaymentIntent(
    {
      orderId,
      orderTickets,
    }: {
      orderId: string;
      orderTickets: TicketOrderDto[];
    },
    tx: DrizzleTransactionScope
  ) {
    const ticketDetails = await this.ticketsService.findByIds(
      orderTickets.map((t) => t.ticketId),
      tx
    );

    const orderedTickets = ticketDetails.map(({ id, title, price }) => {
      const { quantity } = orderTickets.find((t) => t.ticketId === id);

      return { id, title, price, quantity };
    });

    const paymentIntent = await this.paymentGatewayService.createPaymentIntent({
      externalReference: orderId,
      items: orderedTickets,
    });

    return paymentIntent;
  }

  async startOrder({ userId, tickets }: CreateOrderDto) {
    await this.ordersRepository.withTransaction(async (tx) => {
      const orderId = randomUUID();

      const paymentIntent = await this.sendOrderPaymentIntent(
        { orderId, orderTickets: tickets },
        tx
      );

      const order = await this.ordersRepository.create(
        {
          id: orderId,
          userId,
          paymentIntentId: paymentIntent.id,
          expiresAt: addMinutes(new Date(), 15).toISOString(),
          status: 'PENDING',
        },
        tx
      );

      const orderDetails = await this.ordersRepository.createOrderDetails(
        { orderId: order.id, tickets },
        tx
      );

      for (const detail of orderDetails) {
        await this.ticketsService.updateTicketQuantityAction(
          {
            ticketId: detail.ticketId,
            quantity: detail.quantity,
            action: 'RESERVE',
          },
          tx
        );
      }

      return order;
    });
  }

  // async complete(completeOrderDto: {
  //   id: string;
  //   status: 'PAID' | 'REFUNDED';
  // }) {
  //   await this.ordersRepository.withTransaction(async (tx) => {
  //     return this.ordersRepository.changeStatus(
  //       {
  //         id: completeOrderDto.id,
  //         status: completeOrderDto.status,
  //         currentStatus: 'RESERVED',
  //       },
  //       tx
  //     );
  //   });
  // }
}
