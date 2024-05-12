import { sql } from 'drizzle-orm';
import {
  pgTable,
  serial,
  varchar,
  date,
  uuid,
  pgEnum,
} from 'drizzle-orm/pg-core';

// it is a ticket buying system focused on sports events such as football, basketball, etc

/*
i need a USER_TYPE ENUM with the following values:
- ADMIN
- PARTICIPANT
- ORGANIZER
*/
export const userTypeEnum = pgEnum('user_type', [
  'ADMIN',
  'PARTICIPANT',
  'ORGANIZER',
]);

/*
i need a USERS table with the following columns:
- id (uuid)
- name (varchar)
- type (UserTypeEnum)
- email (varchar)
- password (varchar)
- created_at (timestamp)
- updated_at (timestamp)
*/
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email').unique().notNull(),
  name: varchar('name').notNull(),
  type: userTypeEnum('type').default('PARTICIPANT'),
  created_at: date('created_at').defaultNow(),
  updated_at: date('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`current_timestamp()`),
});

/* 
i need a EVENTS table with the following columns:
- id (uuid)
- name (varchar)
- organizer_id (uuid)
- date (timestamp)
- location (varchar)
- price (float)
- tickets_available (int)
- tickets_sold (int)
- tickets_total (int)
- created_at (timestamp)
- updated_at (timestamp)
*/
export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  organizer_id: uuid('organizer_id').notNull(),
  date: varchar('date'),
  location: varchar('location', { length: 256 }),
  price: varchar('price', { length: 256 }),
  tickets_available: varchar('tickets_available', { length: 256 }),
  tickets_sold: varchar('tickets_sold', { length: 256 }),
  tickets_total: varchar('tickets_total', { length: 256 }),
  created_at: date('created_at').defaultNow(),
  updated_at: date('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`current_timestamp(0)`),
});

/*
i need a TICKETSTATUS ENUM with the following values:
- PENDING
- RESERVED
- CANCELLED
*/
export const ticketStatusEnum = pgEnum('ticket_status', [
  'PENDING',
  'RESERVED',
  'CANCELLED',
]);

/* 
i need a TICKETS table with the following columns:
- id (uuid)
- event_id (uuid)
- user_id (uuid)
- status (varchar)
- created_at (timestamp)
- updated_at (timestamp)
*/
export const tickets = pgTable('tickets', {
  id: serial('id').primaryKey(),
  event_id: uuid('event_id'),
  user_id: uuid('user_id'),
  status: ticketStatusEnum('status').default('PENDING'),
  created_at: date('created_at').defaultNow(),
  updated_at: date('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`current_timestamp()`),
});
