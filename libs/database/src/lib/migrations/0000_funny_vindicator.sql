DO $$ BEGIN
 CREATE TYPE "public"."ticket_order_status" AS ENUM('RESERVED', 'PAID', 'PENDING', 'REFUNDED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."ticket_status" AS ENUM('AVAILABLE', 'SOLD_OUT', 'CANCELLED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(50) NOT NULL,
	"description" text,
	"date" varchar,
	"status" varchar DEFAULT 'UPCOMING' NOT NULL,
	"location" varchar(256),
	"organizer_id" uuid NOT NULL,
	"created_at" date DEFAULT now(),
	"updated_at" date DEFAULT now(),
	CONSTRAINT "events_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ticket_order_details" (
	"id" uuid PRIMARY KEY NOT NULL,
	"ticket_order_id" uuid NOT NULL,
	"ticket_id" uuid NOT NULL,
	"price_to_pay" integer NOT NULL,
	"quantity" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ticket_orders" (
	"id" uuid PRIMARY KEY NOT NULL,
	"payment_intent_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "ticket_order_status" DEFAULT 'PENDING' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" date DEFAULT now(),
	"updated_at" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tickets" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"event_id" uuid NOT NULL,
	"price" integer NOT NULL,
	"quantity_total" integer NOT NULL,
	"quantity_available" integer NOT NULL,
	"quantity_sold" integer DEFAULT 0,
	"quantity_reserved" integer DEFAULT 0,
	"status" "ticket_status" DEFAULT 'AVAILABLE' NOT NULL,
	"created_at" date DEFAULT now(),
	"updated_at" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ticket_order_details" ADD CONSTRAINT "ticket_order_details_ticket_order_id_ticket_orders_id_fk" FOREIGN KEY ("ticket_order_id") REFERENCES "public"."ticket_orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ticket_order_details" ADD CONSTRAINT "ticket_order_details_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ticket_orders" ADD CONSTRAINT "ticket_orders_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tickets" ADD CONSTRAINT "tickets_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_title_and_date_idx" ON "events" USING btree ("title","date");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_title_and_event_idx" ON "tickets" USING btree ("title","event_id");