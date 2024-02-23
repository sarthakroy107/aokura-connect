ALTER TABLE "email_activation_token" DROP CONSTRAINT "email_activation_token_profile_id_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "email_activation_token" ALTER COLUMN "token" SET DATA TYPE varchar(140);--> statement-breakpoint
ALTER TABLE "email_activation_token" ADD COLUMN "used" boolean DEFAULT false NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_activation_token" ADD CONSTRAINT "email_activation_token_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
