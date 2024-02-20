ALTER TABLE "profile" ADD COLUMN "next_auth_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_next_auth_id_unique" UNIQUE("next_auth_id");