import { HttpException, HttpStatus } from '@nestjs/common';

export class TicketIsNotAvailableException extends HttpException {
  constructor() {
    super('Ticket is not available', HttpStatus.BAD_REQUEST);
  }
}

export class TicketNotFoundException extends HttpException {
  constructor(id: string) {
    super(`Ticket ${id} not found`, HttpStatus.NOT_FOUND);
  }
}

export class TicketAlreadyExistsException extends HttpException {
  constructor(cause: Error) {
    super('Ticket already exists', HttpStatus.CONFLICT, {
      cause,
    });
  }
}
