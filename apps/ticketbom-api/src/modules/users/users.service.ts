import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as schema from '@ticketbom/database';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  async create({ name, email, birthDate, document }: CreateUserDto) {
    // Create the user in Cognito
    const createUserParams = {
      UserPoolId: 'YOUR_USER_POOL_ID',
      Username: email,
      TemporaryPassword: 'TEMPORARY_PASSWORD',

      UserAttributes: [
        {
          Name: 'name',
          Value: name,
        },
        {
          Name: 'email',
          Value: email,
        },
        // Add more user attributes as needed
      ],
    };
  }
}
