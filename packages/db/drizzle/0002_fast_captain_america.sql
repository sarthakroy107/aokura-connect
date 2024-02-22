CREATE TABLE IF NOT EXISTS "email_activation_token" (
	"token" varchar(128) PRIMARY KEY NOT NULL,
	"profile_id" uuid NOT NULL,
	"expiration_time" timestamp with time zone NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_activation_token" ADD CONSTRAINT "email_activation_token_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
