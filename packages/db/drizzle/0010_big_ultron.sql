ALTER TABLE "invite_token" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;