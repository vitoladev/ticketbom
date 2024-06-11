import { HttpException, HttpStatus } from '@nestjs/common';

export class EventAlreadyExistsException extends HttpException {
  constructor(cause: Error) {
    super('Event already exists', HttpStatus.CONFLICT, {
      cause,
    });
  }
}
