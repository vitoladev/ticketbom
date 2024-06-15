import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  DB_HOST: string;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_PASSWORD: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  DB_PORT: number;

  @IsString()
  DB_NAME: string;


  @IsString()
  MERCADOPAGO_ACCESS_TOKEN: string;

  @IsString()
  COGNITO_CLIENT_ID: string;

  @IsString()
  COGNITO_CLIENT_SECRET: string;

  @IsString()
  COGNITO_USER_POOL_ID: string;

  @IsString()
  COGNITO_ISSUER: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;
}

export function validateEnvConfig(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
