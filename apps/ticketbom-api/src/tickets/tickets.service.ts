import { Inject, Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import {
  NodePgDatabase,
  NodePgQueryResultHKT,
} from 'drizzle-orm/node-postgres';
import * as schema from '@ticketbom/database';
import { eq, ExtractTablesWithRelations } from 'drizzle-orm';
import { PgTransaction } from 'drizzle-orm/pg-core';
import { addMinutes } from 'date-fns';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PaymentsService } from '../payments/payments.service';
import { randomUUID } from 'crypto';

import { convertCentsToFullPrice } from '../common/utils/money';

@Injectable()
export class TicketsService {
  constructor(
    @Inject('DB_DEV') private db: NodePgDatabase<typeof schema>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private paymentGateway: PaymentsService
  ) {}

  async create(createTicketDto: CreateTicketDto) {
    // TODO: Send to SQS to create a ticket

    return this.db.transaction(async (tx) => {
      const ticketId = randomUUID();

      // TODO: Save ticket to MercadoPago payment gateway for payment processing
      const paymentProduct = await this.paymentGateway.createProduct({
        id: ticketId,
        title: createTicketDto.title,
        price: convertCentsToFullPrice(createTicketDto.price),
        quantity: 1,
      });

      console.log({ paymentProduct });

      // Create a ticket in the database
      const ticket = await tx
        .insert(schema.tickets)
        .values({
          id: ticketId,
          title: createTicketDto.title,
          price: createTicketDto.price,
          paymentId: paymentProduct.id,
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
      throw new Error('Ticket is sold out');
    }

    return ticket;
  }

  // execute a transaction to start a buy order by id and return the PIX QR Code to pay for the ticket
  async startOrder({ ticketId, userId }: { ticketId: string; userId: string }) {
    // Start a buy order by id and return the PIX QR Code to pay for the ticket
    // Verify if the ticket is available

    // Create a transaction to ensure that the ticket is not sold out between the time of the select and the update
    const result = await this.db.transaction(async (tx) => {
      const ticket = await this.verifyIfTicketIsAvailable(ticketId, tx);
      console.log({ ticket });
      // Create a buy order for the ticket
      const buyOrder = await tx
        .insert(schema.ticketOrders)
        .values({
          ticketId,
          userId,
          status: 'PENDING',
          expiresAt: addMinutes(new Date(), 15).toISOString(),
        })
        .returning()
        .then((orders) => orders[0]);

      // Update the ticket's quantity available and quantity reserved fields
      await tx
        .update(schema.tickets)
        .set({
          quantityAvailable: ticket.quantityAvailable - 1,
          quantityReserved: ticket.quantityReserved + 1,
        })
        .where(eq(schema.tickets.id, ticketId))
        .execute();
      // Save the buy order to cache

      // Create a PIX QR Code to pay for the ticket using the Pagar.me API and the ticket's price and id

      // Send email with the PIX QR Code to the user
      // Return the PIX QR Code
      return {
        paymentCode:
          '00020126330014BR.GOV.BCB.PIX01141+5561999999999943039865-8020000005303986540510.005802BR5923Ticket Bom6009SAO PAULO62070503***6304B2F9',
        paymentDescription: `Ticket purchase for event ${ticket.eventId}`,
        paymentAmount: ticket.price,
      };
    });
  }

  async refundOrder(id: string) {
    // Cancel a buy order by id
    // Begin a transaction to ensure that the ticket is not sold out between the time of the select and the update, and to ensure that the quantity available is updated correctly
    await this.db.transaction(async (tx) => {
      // Select the ticket by id
      const ticket = await this.verifyIfTicketIsAvailable(id, tx);

      // Update the ticket's quantity available and quantity reserved fields
      const updatedTicket = await tx
        .update(schema.tickets)
        .set({
          quantityAvailable: ticket.quantityAvailable + 1,
          quantityReserved: ticket.quantityReserved - 1,
        })
        .where(eq(schema.tickets.id, id))
        .returning()
        .then((tickets) => tickets[0]);

      // Delete the buy order by id with soft delete
      await tx
        .update(schema.ticketOrders)
        .set({
          status: 'REFUNDED',
        })
        .where(eq(schema.ticketOrders.ticketId, id))
        .execute();

      return updatedTicket;
    });
  }

  // execute a transaction to finish a buy order by id and return the order object with the updated status
  async finishOrder(id: string) {
    // Buy a ticket by id and return the ticket object with the updated quantity available and quantity sold fields
    // Begin a transaction to ensure that the ticket is not sold out between the time of the select and the update, and to ensure that the quantity available is updated correctly
    return this.db.transaction(async (tx) => {
      // Select the ticket by id
      const ticket = await this.verifyIfTicketIsAvailable(id, tx);

      // Update the buy order status to "PAID"
      const order = await tx
        .update(schema.ticketOrders)
        .set({
          status: 'PAID',
        })
        .where(eq(schema.ticketOrders.ticketId, id))
        .returning()
        .then((ticketOrders) => ticketOrders[0]);

      // Update the ticket's quantity available and quantity sold fields
      await tx
        .update(schema.tickets)
        .set({
          quantityAvailable: ticket.quantityAvailable - 1,
          quantitySold: ticket.quantitySold + 1,
          quantityReserved: ticket.quantityReserved - 1,
        })
        .where(eq(schema.tickets.id, id))
        .execute();

      // TODO: Send email with the ticket to the user and organizer of the event with the ticket details using AWS SES
      return order;
    });
  }

  // execute a transaction to reserve a ticket by id and return the ticket object with the updated quantity available and quantity reserved fields
  reserve(id: string) {
    // Reserve a ticket by id and return the ticket object with the updated quantity available and quantity reserved fields
    // Begin a transaction to ensure that the ticket is not sold out between the time of the select and the update, and to ensure that the quantity available is updated correctly
    return this.db.transaction(async (tx) => {
      const ticket = await this.verifyIfTicketIsAvailable(id, tx);

      // Update the ticket's quantity available and quantity reserved fields
      await tx
        .update(schema.tickets)
        .set({
          quantityAvailable: ticket.quantityAvailable - 1,
          quantityReserved: ticket.quantityReserved + 1,
        })
        .where(eq(schema.tickets.id, id))
        .returning()
        .then((tickets) => tickets[0]);

      // Update the buy order by id to RESERVED
      const order = await tx
        .update(schema.ticketOrders)
        .set({
          status: 'RESERVED',
        })
        .where(eq(schema.ticketOrders.ticketId, id))
        .returning()
        .execute();

      // TODO: Save the buy order to cache
      return order;
    });
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
