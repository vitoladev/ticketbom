import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  HttpCode,
  Param,
  Post,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { TicketDto } from './dto/ticket.dto';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Ticket created',
    type: TicketDto,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Ticket with the same title and event already exists',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTicketDto: CreateTicketDto): Promise<TicketDto> {
    return this.ticketsService.create(createTicketDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ticketsService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.ticketsService.remove(id);
  }
}
