import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {
  AdminCreateUserCommand,
  AdminCreateUserCommandInput,
  AdminGetUserCommand,
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from '@aws-sdk/client-cognito-identity-provider';

@Injectable()
export class UsersService {
  constructor(private readonly cognitoClient: CognitoIdentityProviderClient) {}
  async create({ name, email }: CreateUserDto) {
    const createUserParams: AdminCreateUserCommandInput = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
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
    // Create the user in Cognito
    const createUserCommand = new AdminCreateUserCommand(createUserParams);
    await this.cognitoClient.send(createUserCommand);
  }

  async findAll() {
    // Find all users in Cognito
    // TODO: check if users are already in cache

    // TODO: Implement pagination with Limit and PaginationToken options
    const listUsersCommand = new ListUsersCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
    });
    const listUsersOutput = await this.cognitoClient.send(listUsersCommand);

    const users = listUsersOutput.Users.map((user) => ({
      id: user.Username,
      email: user.Attributes[0].Value, // Assuming the first attribute is the user's name
      status: user.UserStatus,
      birthdate: user.Attributes.find((attr) => attr.Name === 'birthdate')
        ?.Value,
      emailVerified: Boolean(
        user.Attributes.find((attr) => attr.Name === 'email_verified')?.Value
      ),
      enabled: user.Enabled,
    }));

    // TODO: store users in cache
    return users;
  }

  async findOne(id: string) {
    // Find a single user in Cognito
    const findUserCommand = new AdminGetUserCommand({
      Username: id,
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
    });

    const user = await this.cognitoClient.send(findUserCommand);
    return user;
  }
}
