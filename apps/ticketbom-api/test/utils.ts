import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { validateEnvConfig, configurationFn } from '../src/common/config';
import { DrizzlePGModule } from '../src/common/drizzle/drizzle.module';
import { CacheModule } from '@nestjs/cache-manager';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { CatchAllExceptionFilter } from '../src/common/filters/catch-all-exception.filter';

export const setupTestModuleFixture = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  moduleToTest: any
): Promise<TestingModule> => {
  return await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        validate: validateEnvConfig,
        load: [configurationFn],
        isGlobal: true,
      }),
      DrizzlePGModule.registerAsync({
        tag: 'DB_DEV',
        useFactory: () => ({
          connection: 'client',
        }),
      }),
      CacheModule.register({
        isGlobal: true,
      }),
      moduleToTest,
    ],
  }).compile();
};

export const setupTestAppConfig = async (app: NestFastifyApplication) => {
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new CatchAllExceptionFilter());

  await app.init();
  await app.getHttpAdapter().getInstance().ready();
};
