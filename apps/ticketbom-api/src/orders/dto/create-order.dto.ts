import { IsArray, IsInt, IsUUID, ValidateNested } from 'class-validator';

class TicketOrderDto {
  @IsUUID()
  ticketId: string;

  @IsInt()
  quantity: number;
}

export class CreateOrderDto {
  @IsUUID()
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  tickets: TicketOrderDto[];
}
