import { relations, sql } from 'drizzle-orm';
import {
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable('user', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
});

export const eventStatusEnum = pgEnum('event_status', [
  'UPCOMING',
  'ONGOING',
  'FINISHED',
]);

export const ticketStatusEnum = pgEnum('ticket_status', [
  'AVAILABLE',
  'SOLD_OUT',
  'CANCELLED',
]);

export const ticketOrderStatusEnum = pgEnum('ticket_order_status', [
  'RESERVED',
  'PAID',
  'PENDING',
  'REFUNDED',
]);

export const events = pgTable('events', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: varchar('title', { length: 256 }).notNull(),
  description: text('description'),
  date: varchar('date'),
  status: eventStatusEnum('status').default('UPCOMING'),
  location: varchar('location', { length: 256 }),
  organizerId: uuid('organizer_id').notNull(),
  createdAt: date('created_at').defaultNow(),
  updatedAt: date('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`current_timestamp()`),
});

export const tickets = pgTable('tickets', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id),
  price: integer('price').notNull(),
  quantityTotal: integer('quantity_total').notNull(),
  quantityAvailable: integer('quantity_available').notNull(),
  quantitySold: integer('quantity_sold').default(0),
  quantityReserved: integer('quantity_reserved').default(0),
  status: ticketStatusEnum('status').default('AVAILABLE'),
  createdAt: date('created_at').defaultNow(),
  updatedAt: date('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`current_timestamp()`),
});

export const ticketOrders = pgTable('ticket_orders', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  ticketId: uuid('ticket_id')
    .notNull()
    .references(() => tickets.id),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  status: ticketOrderStatusEnum('status').notNull(),
  expiresAt: date('expires_at').notNull(),
  createdAt: date('created_at').defaultNow(),
  updatedAt: date('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`current_timestamp()`),
});

export const ticketsRelations = relations(tickets, ({ one, many }) => ({
  event: one(events, { fields: [tickets.eventId], references: [events.id] }),
  reservations: many(ticketOrders, { relationName: 'reservations' }),
}));

export const ticketReservationsRelations = relations(
  ticketOrders,
  ({ one }) => ({
    ticket: one(tickets, {
      fields: [ticketOrders.ticketId],
      references: [tickets.id],
    }),
    user: one(users, { fields: [ticketOrders.userId], references: [users.id] }),
  })
);

export const eventsRelations = relations(events, ({ one, many }) => ({
  organizer: one(users, {
    fields: [events.organizerId],
    references: [users.id],
  }),
  tickets: many(tickets),
}));
