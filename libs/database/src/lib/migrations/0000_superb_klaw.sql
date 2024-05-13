DO $$ BEGIN
 CREATE TYPE "public"."ticket_status" AS ENUM('PENDING', 'RESERVED', 'CANCELLED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_type" AS ENUM('ADMIN', 'PARTICIPANT', 'ORGANIZER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"organizer_id" uuid NOT NULL,
	"date" varchar,
	"location" varchar(256),
	"price" varchar(256),
	"tickets_available" varchar(256),
	"tickets_sold" varchar(256),
	"tickets_total" varchar(256),
	"created_at" date DEFAULT now(),
	"updated_at" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tickets" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" uuid,
	"user_id" uuid,
	"status" "ticket_status" DEFAULT 'PENDING',
	"created_at" date DEFAULT now(),
	"updated_at" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"name" varchar NOT NULL,
	"type" "user_type" DEFAULT 'PARTICIPANT',
	"created_at" date DEFAULT now(),
	"updated_at" date DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
