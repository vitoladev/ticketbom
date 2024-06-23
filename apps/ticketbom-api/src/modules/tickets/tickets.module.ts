import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { PaymentsModule } from '../../payments/payments.module';
import { TicketsRepositoryProvider } from './tickets.repository';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register(), PaymentsModule],
  controllers: [TicketsController],
  providers: [TicketsRepositoryProvider, TicketsService],
  exports: [TicketsRepositoryProvider, TicketsService],
})
export class TicketsModule {}
