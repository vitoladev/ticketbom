import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {
  }

  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(createTicketDto);
  }

  @Get(':eventId')
  findByEventId(@Param('eventId') eventId: string) {
    return this.ticketsService.findByEventId(eventId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(id);
  }

  @Post(':id/start-order')
  startOrder(@Param('id') id: string) {
    return this.ticketsService.startOrder({ ticketId: id, userId: '123' });
  }

  @Post(':id/verify')
  verify(@Param('id') id: string) {
    return this.ticketsService.verifyIfTicketIsAvailable(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTicketDto: ReserveTicketDto) {
  //   return this.ticketsService.update(id, updateTicketDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(id);
  }
}
