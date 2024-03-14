CREATE TABLE IF NOT EXISTS "invite_token" (
	"token" varchar(140) PRIMARY KEY NOT NULL,
	"server_id" uuid NOT NULL,
	"creator_profile_id" uuid NOT NULL,
	"expiration" timestamp with time zone NOT NULL,
	"has_limit" boolean DEFAULT false NOT NULL,
	"limit" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invite_token" ADD CONSTRAINT "invite_token_server_id_server_id_fk" FOREIGN KEY ("server_id") REFERENCES "server"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invite_token" ADD CONSTRAINT "invite_token_creator_profile_id_profile_id_fk" FOREIGN KEY ("creator_profile_id") REFERENCES "profile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
