import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { EventAlreadyExistsException } from '@modules/events/events.exceptions';

@Catch()
export class CatchAllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      const isInternal = status === 500;
      if (isInternal) {
        Logger.error(exception.message, exception.stack, 'InternalServerError');
        return response.status(status).send({
          statusCode: status,
          message: 'Internal Server Error',
          timestamp: new Date().toISOString(),
        });
      }

      const badRequestResponse = exception.getResponse();

      return response.status(status).send(badRequestResponse);
    }

    if (
      exception instanceof Error &&
      exception.message.includes(
        'duplicate key value violates unique constraint'
      )
    ) {
      const isEvent = request.url.includes('events');
      if (isEvent) throw new EventAlreadyExistsException(exception);

      response.status(409).send({
        statusCode: 409,
        message: 'Conflict',
        timestamp: new Date().toISOString(),
      });
    }

    if (exception instanceof Error) {
      Logger.error(
        exception.message,
        exception.stack,
        'UnknownInternalServerError'
      );
    }

    response.status(500).send({
      statusCode: 500,
      message: 'Internal Server Error',
      timestamp: new Date().toISOString(),
    });
  }
}
