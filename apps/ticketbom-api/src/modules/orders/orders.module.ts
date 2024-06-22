import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersRepositoryProvider } from './orders.repository';
import { TicketsRepositoryProvider } from '../tickets/tickets.repository';
import { TicketsService } from '../tickets/tickets.service';

@Module({
  controllers: [OrdersController],
  providers: [
    TicketsRepositoryProvider,
    TicketsService,
    OrdersRepositoryProvider,
    OrdersService,
  ],
})
export class OrdersModule {}
