import { and, eq, or } from "drizzle-orm";
import { db } from "../../db.js";
import { Conversation, Profile } from "../../schema.js";

export async function getPendingConversations(profileId: string) {
  try {
    const pendingConversation = await db
      .select({
        conversationId: Conversation.id,
        senderId: Conversation.memberOne,
        senderName: Profile.name,
        senderAvatar: Profile.avatar,
      })
      .from(Conversation)
      .where(
        and(
          eq(Conversation.memberTwo, profileId),
          eq(Conversation.invitationAccepted, false)
        )
      )
      .innerJoin(Profile, eq(Conversation.memberOne, Profile.id));

    return {
      success: true as true,
      data: pendingConversation,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false as const,
      error: "Failed to get pending conversations in DB",
    };
  }
}

export async function getConversations(profileId: string) {
  try {
    const conversations = await db.query.Conversation.findMany({
      where: or(
        eq(Conversation.memberOne, profileId),
        eq(Conversation.memberTwo, profileId)
      ),
      with: {
        memberOne: {
          columns: {
            avatar: true,
            name: true,
            id: true,
            username: true,
          },
        },
        memberTwo: {
          columns: {
            avatar: true,
            name: true,
            id: true,
            username: true,
          },
        },
      },
    });
    return {
      success: true as const,
      data: conversations,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false as const,
      error: "Failed to get active conversations in DB",
    };
  }
}
