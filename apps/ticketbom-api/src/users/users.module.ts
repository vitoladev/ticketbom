import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CognitoAuthModule } from '@nestjs-cognito/auth';

@Module({
  imports: [
    CognitoAuthModule.register({
      jwtVerifier: {
        userPoolId: process.env.COGNITO_USER_POOL_ID,
        clientId: process.env.COGNITO_CLIENT_ID,
        tokenUse: 'id',
      },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
