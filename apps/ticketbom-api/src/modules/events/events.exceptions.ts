import { HttpException, HttpStatus } from '@nestjs/common';

export class EventAlreadyExistsException extends HttpException {
  constructor(cause: Error) {
    super('Event already exists', HttpStatus.CONFLICT, {
      cause,
    });
  }
}

export class EventNotFoundException extends HttpException {
  constructor(id: string) {
    super(`Event ${id} not found`, HttpStatus.NOT_FOUND);
  }
}

export class EventDoesNotExistException extends HttpException {
  constructor(id: string) {
    super(`Event ${id} does not exist`, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
