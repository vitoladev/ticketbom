DO $$ BEGIN
 CREATE TYPE "public"."event_status" AS ENUM('UPCOMING', 'ONGOING', 'FINISHED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "events" RENAME COLUMN "name" TO "title";--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "tickets" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "status" "event_status" DEFAULT 'UPCOMING';--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "price" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN IF EXISTS "price";