import { db } from "../../db.js";
import { Conversation } from "../../schema.js";

export default async function createConversationOperation({
  profileId1,
  profileId2,
}: {
  profileId1: string;
  profileId2: string;
}) {
  try {
    //*Make sure profielId1 starts the conversation
    const newConversation = await db
      .insert(Conversation)
      .values({ memberOne: profileId1, memberTwo: profileId2 }).returning();
    return {
      success: true,
      data: newConversation[0],
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error,
    };
  }
}
