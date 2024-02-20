ALTER TABLE "profile" DROP CONSTRAINT "profile_clerk_user_id_unique";--> statement-breakpoint
ALTER TABLE "profile" DROP COLUMN IF EXISTS "clerk_user_id";