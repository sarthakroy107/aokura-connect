import { eq } from "drizzle-orm";
import { db } from "../../db.js";
import { Conversation } from "../../schema.js";

export default async function getCoversationDetailsOperation({
  conversationId,
}: {
  conversationId: string;
}) {
  try {
    const data = await db.query.Conversation.findFirst({
      where: eq(Conversation.id, conversationId),
      with: {
        memberOne: true,
        memberTwo: true,
      }
    })

    return {
      success: true as const,
      data
    };
  } catch (error) {
    console.error(error);
    return {
      success: false as const,
      error
    };
  }

  
}
