import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { handlePostgresError, isPostgresError } from '@common/utils/errors';

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

      const errorResponse = exception.getResponse();
      if (typeof errorResponse === 'string') {
        return response.status(status).send({
          statusCode: status,
          message: errorResponse,
          timestamp: new Date().toISOString(),
        });
      }

      return response.status(status).send(errorResponse);
    }

    if (isPostgresError(exception)) {
      handlePostgresError(exception, request, response);
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
