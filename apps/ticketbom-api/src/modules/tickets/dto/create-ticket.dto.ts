import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ format: 'uuid' })
  eventId: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  price: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  quantityTotal: number;

  @IsNotEmpty()
  @ApiProperty({ enum: ['AVAILABLE', 'SOLD_OUT', 'CANCELLED'] })
  @IsEnum(['AVAILABLE', 'SOLD_OUT', 'CANCELLED'])
  status: 'AVAILABLE' | 'SOLD_OUT' | 'CANCELLED';
}
