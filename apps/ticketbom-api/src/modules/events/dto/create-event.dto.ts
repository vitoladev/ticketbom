import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { EventStatus } from '../entities/event.entity';
import { IsFutureDateString } from '@common/validators/IsFutureDateString';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  @Validate(IsFutureDateString, { message: 'Date must be in the future' })
  @ApiProperty({ type: String, format: 'date-time' })
  date: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  location: string;

  @IsNotEmpty()
  @IsEnum(EventStatus)
  @ApiProperty({ enum: EventStatus })
  // validate the status field using the EventStatus enum
  status: EventStatus;
}
