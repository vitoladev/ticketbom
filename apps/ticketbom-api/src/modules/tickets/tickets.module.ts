import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { PaymentsModule } from '../../payments/payments.module';
import { TicketsRepositoryProvider } from './tickets.repository';

@Module({
  imports: [PaymentsModule],
  controllers: [TicketsController],
  providers: [
    TicketsRepositoryProvider,
    TicketsService,
  ],
  exports: [TicketsService],
})
export class TicketsModule {}
