import { Inject, Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ITicketsRepository } from './tickets.repository';
import { DrizzleTransactionScope } from '@ticketbom/database';
import { TicketIsNotAvailableException } from './tickets.exceptions';

@Injectable()
export class TicketsService {
  constructor(
    @Inject(ITicketsRepository) private ticketsRepository: ITicketsRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async create(createTicketDto: CreateTicketDto) {
    // TODO: Send to SQS to create a ticket
    return this.ticketsRepository.withTransaction(async (tx) => {
      const ticket = await this.ticketsRepository.create(
        {
          title: createTicketDto.title,
          status: 'AVAILABLE',
          price: createTicketDto.price,
          eventId: createTicketDto.eventId,
          quantityTotal: createTicketDto.quantityTotal,
          quantityAvailable: createTicketDto.quantityTotal,
        },
        tx
      );

      await this.cacheManager.del(`tickets:event:${ticket.eventId}`);
      await this.cacheManager.set(`ticket:${ticket.id}`, ticket);
      return ticket;
    });
  }

  async updateTicketQuantityAction(
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
  ) {
    await this.ticketsRepository.updateTicketQuantityAction(
      {
        ticketId,
        quantity,
        action,
      },
      tx
    );
  }

  async verifyIfTicketIsAvailable(id: string, tx?: DrizzleTransactionScope) {
    const ticket = await this.ticketsRepository.findOne(id, tx);

    if (ticket.quantityAvailable === 0 || ticket.status === 'SOLD_OUT') {
      throw new TicketIsNotAvailableException();
    }

    return ticket;
  }

  async findManyByEventId(eventId: string) {
    const cachedData = await this.cacheManager.get(`tickets:event:${eventId}`);
    if (cachedData) return cachedData;

    const tickets = await this.ticketsRepository.findByEventId(eventId);

    await this.cacheManager.set(`tickets:event:${eventId}`, tickets);

    return tickets;
  }

  async findByIds(ids: string[], tx?: DrizzleTransactionScope) {
    return this.ticketsRepository.findByIds(ids, tx);
  }

  async findOne(id: string) {
    const cachedData = await this.cacheManager.get(`ticket:${id}`);
    if (cachedData) return cachedData;

    const ticket = await this.ticketsRepository.findOne(id);
    await this.cacheManager.set(`ticket:${ticket.id}`, ticket);

    return ticket;
  }

  async remove(id: string) {
    await this.ticketsRepository.delete(id);
  }
}
