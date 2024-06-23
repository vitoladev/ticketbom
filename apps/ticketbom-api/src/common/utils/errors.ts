import {
  EventDoesNotExistException,
  EventAlreadyExistsException,
} from '@modules/events/events.exceptions';
import { CreateTicketDto } from '@modules/tickets/dto/create-ticket.dto';
import { Logger } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

type PostgresError = Error & {
  code: string;
  detail: string;
  constraint: string;
};

export const isPostgresError = (exception: any): exception is PostgresError =>
  exception?.code !== undefined &&
  exception?.detail !== undefined &&
  exception?.constraint !== undefined;

export const isCreateTicketDto = (obj: any): obj is CreateTicketDto =>
  obj && typeof obj.eventId === 'string';

export const handlePostgresError = (
  exception: PostgresError,
  request: FastifyRequest,
  response: FastifyReply
) => {
  const isForeignKeyViolation = exception.code === '23503';
  if (isForeignKeyViolation) {
    Logger.error(
      exception.detail,
      exception.stack,
      'ForeignKeyViolationException'
    );

    if (
      exception.constraint === 'tickets_event_id_events_id_fk' &&
      isCreateTicketDto(request.body)
    ) {
      throw new EventDoesNotExistException(request.body.eventId);
    }

    response.status(422).send({
      statusCode: 422,
      message: 'Unprocessable Entity',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  const isUniqueViolation = exception.code === '23505';
  if (isUniqueViolation) {
    Logger.error(exception.detail, exception.stack, 'UniqueViolationException');

    const isEvent = request.url.includes('events');
    if (isEvent) throw new EventAlreadyExistsException(exception);

    response.status(409).send({
      statusCode: 409,
      message: 'Conflict',
      timestamp: new Date().toISOString(),
    });
    return;
  }
};
