import {
  IsDateString,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { EventStatus } from '../entities/event.entity';
import { IsFutureDateString } from '../../common/validators/IsFutureDateString';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  description: string;

  @IsNotEmpty()
  @IsDateString()
  @Validate(IsFutureDateString, { message: 'Date must be in the future' })
  date: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  // validate the status field using the EventStatus enum
  status: EventStatus;
}
