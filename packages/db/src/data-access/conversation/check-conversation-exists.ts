import { and, eq, or } from "drizzle-orm";
import { db } from "../../db.js";
import { Conversation } from "../../schema.js";

export default async function checkConversationExistsOperation({
  profileId1,
  profileId2,
}: {
  profileId1: string;
  profileId2: string;
}) {
  try {
    const conversation = await db
      .select()
      .from(Conversation)
      .where(
        and(
          or(
            eq(Conversation.memberOne, profileId1),
            eq(Conversation.memberOne, profileId2)
          ),
          or(
            eq(Conversation.memberTwo, profileId1),
            eq(Conversation.memberTwo, profileId2)
          )
        )
      );
    if (conversation.length > 0) {
      return {
        success: true as const,
        status: 200 as const,
        data: conversation[0],
      };
    } else
      return {
        success: true,
        status: 404,
        error: "Conversation not found",
      };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error,
    };
  }
}
