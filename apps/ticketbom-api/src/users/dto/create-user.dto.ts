import { IsEmail, IsEnum, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;
  @IsEmail()
  email: string;

  @IsEnum(['ADMIN', 'PARTICIPANT', 'ORGANIZER'], {
    message: 'INVALID_USER_TYPE',
  })
  type: 'ADMIN' | 'PARTICIPANT' | 'ORGANIZER';
}
