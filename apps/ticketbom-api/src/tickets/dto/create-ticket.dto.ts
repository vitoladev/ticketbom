import { IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateTicketDto {

  @IsNotEmpty()
  @IsUUID()
  eventId: string;

  @IsNotEmpty()
  @IsInt()
  price: number;

  @IsNotEmpty()
  @IsInt()
  quantityTotal: number;



  @IsNotEmpty()
  @IsString()
  status: 'AVAILABLE' | 'SOLD_OUT' | 'CANCELLED';
}
