ALTER TABLE "message" ADD COLUMN "in_reply_to" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "message" ADD CONSTRAINT "message_in_reply_to_message_id_fk" FOREIGN KEY ("in_reply_to") REFERENCES "message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
