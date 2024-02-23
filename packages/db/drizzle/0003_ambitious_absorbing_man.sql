ALTER TABLE "message" DROP CONSTRAINT "message_sender_member_id_member_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "message" ADD CONSTRAINT "message_sender_member_id_member_id_fk" FOREIGN KEY ("sender_member_id") REFERENCES "member"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
