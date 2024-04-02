import { db } from "../../db.js";
import { Conversation, DirectMessage } from "../../schema.js";

export default async function createDMOperation({
  conversationId,
  senderProfileId,
  receiverProfileId,
  files,
  inReplyTo,
  textContent,
}: {
  conversationId: string;
  senderProfileId: string;
  receiverProfileId: string;
  files?: string[] | undefined;
  textContent: string;
  inReplyTo?: string ;
}) {
  try {
    const newDm = await db
      .insert(DirectMessage)
      .values({
        conversationId,
        files,
        senderProfileId,
        content: textContent,
        inReplyTo,
      }).returning();
    return {
      success: true,
      data: newDm[0]
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error,
    };
  }
}
