/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyHelmet from '@fastify/helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { CatchAllExceptionFilter } from '@common/filters/catch-all-exception.filter';
import { setupGracefulShutdown } from 'nestjs-graceful-shutdown';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true })
  );
  await app.register(fastifyHelmet);

  setupGracefulShutdown({ app });

  // prefix with enverionment variable
  const API_PREFIX = process.env.API_PREFIX || 'api';

  const globalPrefix = API_PREFIX;
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new CatchAllExceptionFilter());
  app.setGlobalPrefix(globalPrefix);

  const swaggerEnabled = process.env.SWAGGER_ENABLED === 'true';

  if (swaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('Ticketbom API')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  const port = process.env.PORT || 3000;

  await app.listen(port, '0.0.0.0');
  Logger.log(
    `🚀 Application is running on: ${await app.getUrl()}/${globalPrefix}`
  );
  Logger.log(`📚 Swagger docs ${swaggerEnabled ? 'enabled' : 'disabled'}!`);
  if (swaggerEnabled) {
    Logger.log(`📚 Swagger docs running on: ${await app.getUrl()}/docs`);
  }
}

bootstrap();
