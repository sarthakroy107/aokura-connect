import { eq } from "drizzle-orm";
import { db } from "../../db.js";
import { Conversation } from "../../schema.js";

export default async function getConversationDetailsOperation(
  conversationId: string
) {
  try {
    const conversation = await db.query.Conversation.findFirst({
      where: eq(Conversation.id, conversationId),
      with: {
        memberOne: true,
        memberTwo: true,
      },
    });

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    return {
      success: true,
      data: conversation,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: `Failed to get conversation details from DB, ${error}`,
    };
  }
}
