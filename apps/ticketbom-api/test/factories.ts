import {
  EventEntity,
  EventStatus,
  TicketEntity,
  TicketStatus,
} from '../../../libs/database/src';
import { faker } from '@faker-js/faker';

export type EventFactoryEntity = Omit<
  EventEntity,
  'id' | 'createdAt' | 'updatedAt' | 'organizerId'
>;

export const eventFactory = (): EventFactoryEntity => ({
  title: faker.lorem.words(3),
  description: faker.lorem.paragraph(),
  date: faker.date.future().toISOString(),
  status: faker.helpers.enumValue(EventStatus),
  location: faker.location.streetAddress(),
});

export const ticketFactory = (
  eventId: string
): Pick<
  TicketEntity,
  'title' | 'price' | 'status' | 'quantityTotal' | 'eventId'
> => ({
  title: faker.lorem.words(3),
  price: faker.number.float({ min: 10, max: 100, fractionDigits: 2 }),
  status: faker.helpers.enumValue(TicketStatus),
  quantityTotal: faker.number.int({ min: 10, max: 100 }),
  eventId,
});
