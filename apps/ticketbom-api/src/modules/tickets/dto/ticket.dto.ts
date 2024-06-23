import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { CreateTicketDto } from './create-ticket.dto';
import { TicketEntity } from '@ticketbom/database';
import { convertCentsToFullAmount } from '@common/utils/money';

export class TicketDto extends CreateTicketDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => convertCentsToFullAmount(value))
  price: number;
}
