import { convertFullAmountToCents } from '@common/utils/money';
import { ApiProperty } from '@nestjs/swagger';
import { TicketStatus } from '@ticketbom/database';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
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
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => convertFullAmountToCents(value), {
    toClassOnly: true,
  })
  @ApiProperty({ format: 'float32', example: 500 })
  price: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @ApiProperty({ format: 'int32', example: 100 })
  quantityTotal: number;

  @IsNotEmpty()
  @ApiProperty({ enum: TicketStatus })
  @IsEnum(TicketStatus)
  status: TicketStatus;
}
