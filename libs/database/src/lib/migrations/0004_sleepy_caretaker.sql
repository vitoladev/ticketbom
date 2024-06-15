CREATE TABLE IF NOT EXISTS "ticket_order_details" (
	"id" uuid PRIMARY KEY NOT NULL,
	"ticket_order_id" uuid NOT NULL,
	"ticket_id" uuid NOT NULL,
	"quantity" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ticket_orders" RENAME COLUMN "ticket_id" TO "payment_intent_id";--> statement-breakpoint
ALTER TABLE "ticket_orders" DROP CONSTRAINT "ticket_orders_ticket_id_tickets_id_fk";
--> statement-breakpoint
ALTER TABLE "ticket_orders" ALTER COLUMN "status" SET DEFAULT 'PENDING';--> statement-breakpoint
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
ALTER TABLE "tickets" DROP COLUMN IF EXISTS "payment_id";