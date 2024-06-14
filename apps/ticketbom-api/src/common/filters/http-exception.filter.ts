import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { EventAlreadyExistsException } from '../../events/events.exceptions';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      const isInternal = status === 500;
      if (isInternal) {
        console.log(exception);
      }

      const message = isInternal ? 'Internal Server Error' : exception.message;

      response.status(status).send({
        statusCode: status,
        message,
        timestamp: new Date().toISOString(),
      });
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

    response.status(500).send({
      statusCode: 500,
      message: 'Internal Server Error',
      timestamp: new Date().toISOString(),
    });
  }
}
