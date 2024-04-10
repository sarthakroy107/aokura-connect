import { eq } from "drizzle-orm";
import { db } from "../../db.js";
import { Conversation } from "../../schema.js";

export async function acceptConversation(conversationId: string) {
  try {
    await db
      .update(Conversation)
      .set({ invitationAccepted: true })
      .where(eq(Conversation.id, conversationId));
    return true;
  } catch (error) {
    return false;
  }
}
