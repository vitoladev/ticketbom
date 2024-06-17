import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDto } from './create-ticket.dto';
import { ValidateIf } from 'class-validator';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
  @ValidateIf((value) => value !== null)
  quantityAvailable!: number | null;

  @ValidateIf((value) => value !== null)
  quantityReserved!: number | null;
}
