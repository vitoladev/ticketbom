import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTicketDto {
  @MinLength(3)
  @MaxLength(50)
  @IsNotEmpty()
  @IsString()
  title: string;

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
  @IsEnum(['AVAILABLE', 'SOLD_OUT', 'CANCELLED'])
  status: 'AVAILABLE' | 'SOLD_OUT' | 'CANCELLED';
}
