import { sql } from 'drizzle-orm';
import {
  pgTable,
  serial,
  varchar,
  date,
  uuid,
  pgEnum,
  integer,
  primaryKey,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

// it is a ticket buying system focused on sports events such as football, basketball, etc
import type { AdapterAccountType } from 'next-auth/adapters';

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
});

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (table) => {
    return {
      compositePk: primaryKey({
        columns: [table.provider, table.providerAccountId],
      }),
    };
  }
);

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (table) => {
    return {
      compositePk: primaryKey({ columns: [table.identifier, table.token] }),
    };
  }
);

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  date: varchar('date'),
  location: varchar('location', { length: 256 }),
  price: varchar('price', { length: 256 }),
  organizer_id: uuid('organizer_id').notNull(),
  created_at: date('created_at').defaultNow(),
  updated_at: date('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`current_timestamp(0)`),
});

export const ticketStatusEnum = pgEnum('ticket_status', [
  'PENDING',
  'RESERVED',
  'CANCELLED',
]);

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
