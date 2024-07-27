import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CognitoAuthModule } from '@nestjs-cognito/auth';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

@Module({
  imports: [
    CognitoAuthModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        jwtVerifier: {
          userPoolId: configService.get<string>('cognito.userPoolId'),
          clientId: configService.get<string>('cognito.clientId'),
          tokenUse: 'id',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: CognitoIdentityProviderClient,
      useFactory: (configService: ConfigService) =>
        new CognitoIdentityProviderClient({
          region: configService.get<string>('cognito.region'),
        }),
      inject: [ConfigService],
    },
    UsersService,
  ],
})
export class UsersModule {}
