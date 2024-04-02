"use server";

import { currentProfile } from "@/lib/auth/current-user";
import checkConversationExistsOperation from "@db/data-access/conversation/check-conversation-exists";
import createConversationOperation from "@db/data-access/conversation/create-conversation";
import createDMOperation from "@db/data-access/direct-message/create-dm";

export default async function dmFromServerChannelAction({
  textContent,
  receiverProfileId,
}: {
  receiverProfileId: string;
  textContent: string;
}) {
  try {
    const profile = await currentProfile();
    if (!profile.data || profile.status !== 200) {
      return {
        success: false,
        status: 401,
        error: "Unauthorized",
      };
    }

    const hasConversation = await checkConversationExistsOperation({
      profileId1: profile.data.id,
      profileId2: receiverProfileId,
    });

    let conversationId: string; // Assign a value to conversationId
    if (
      !hasConversation.success ||
      hasConversation.status !== 200 ||
      !hasConversation.data
    ) {
      const newConversation = await createConversationOperation({
        profileId1: profile.data.id, //* Profile1 starts the conversation
        profileId2: receiverProfileId,
      });

      if (!newConversation.success || !newConversation.data) {
        throw new Error("Failed to create conversation");
      }

      conversationId = newConversation.data.id; // Assign the conversationId value
    } else {
      conversationId = hasConversation.data.id; // Assign the conversationId value
    }

    const newDm = await createDMOperation({
      conversationId,
      textContent,
      senderProfileId: profile.data.id,
      receiverProfileId,
    });
    if (!newDm.success || !newDm.data) {
      return {
        success: false,
        status: 500,
        error: "Problem in message creation",
      };
    } else
      return {
        success: true,
        status: 200,
        data: newDm.data,
      };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      status: 500,
      error,
    };
  }
}
