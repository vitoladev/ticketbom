ALTER TABLE "events" ALTER COLUMN "title" SET DATA TYPE varchar(50);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_title_and_date_idx" ON "events" ("title","date");