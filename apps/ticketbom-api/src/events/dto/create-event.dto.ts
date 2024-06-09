import { IsDateString, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { EventStatus } from '../entities/event.entity';

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
  date: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  // validate the status field using the EventStatus enum
  status: EventStatus;
}
