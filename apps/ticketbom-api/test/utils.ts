import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { validateEnvConfig, configurationFn } from '../src/common/config';
import { DrizzlePGModule } from '../src/common/drizzle/drizzle.module';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { ClassSerializerInterceptor, Type, ValidationPipe } from '@nestjs/common';
import { CatchAllExceptionFilter } from '../src/common/filters/catch-all-exception.filter';
import { DrizzleDatabase } from '@ticketbom/database';
import { Reflector } from '@nestjs/core';

export const setupTestModuleFixture = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modulesToTest: Type<any>[]
): Promise<TestingModule> => {
  const modules = [
    ConfigModule.forRoot({
      validate: validateEnvConfig,
      load: [configurationFn],
      isGlobal: true,
    }),
    DrizzlePGModule.registerAsync({
      tag: DrizzleDatabase,
      useFactory: () => ({
        connection: 'client',
      }),
    }),
    ...modulesToTest,
  ];

  return Test.createTestingModule({
    imports: modules,
  }).compile();
};

export const setupTestAppConfig = async (app: NestFastifyApplication) => {
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new CatchAllExceptionFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
};
