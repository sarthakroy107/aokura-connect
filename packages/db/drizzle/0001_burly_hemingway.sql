ALTER TABLE "direct_message" DROP CONSTRAINT "direct_message_sender_profile_id_member_id_fk";
--> statement-breakpoint
ALTER TABLE "direct_message" DROP CONSTRAINT "direct_message_conversation_id_channel_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "direct_message" ADD CONSTRAINT "direct_message_sender_profile_id_profile_id_fk" FOREIGN KEY ("sender_profile_id") REFERENCES "profile"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "direct_message" ADD CONSTRAINT "direct_message_conversation_id_coversation_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "coversation"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
