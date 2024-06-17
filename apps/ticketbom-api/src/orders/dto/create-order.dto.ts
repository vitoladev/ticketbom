import { IsArray, IsInt, IsUUID, ValidateNested } from 'class-validator';

export class TicketOrderDto {
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

export class StartOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  tickets: TicketOrderDto[];
}
