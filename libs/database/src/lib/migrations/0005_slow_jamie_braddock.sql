ALTER TABLE "tickets" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_title_and_event_idx" ON "tickets" USING btree ("title","event_id");