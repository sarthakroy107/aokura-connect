"use server";
import { currentProfile } from "@/lib/auth/current-user";
import getConversationDetailsOperation from "@db/data-access/conversation/get-conversation-details";

export default async function getConversationDetails(conversationId: string) {
  const profile = await currentProfile();
  if (!profile.data) {
    return {
      success: false,
      message: `Unauthorized, ${profile.message}`,
      data: null,
    };
  }

  const conversationDetails =
    await getConversationDetailsOperation(conversationId);
  if (!conversationDetails.success) {
    return {
      success: false,
      message: conversationDetails.message,
      data: null,
    };
  }
  if (!conversationDetails.data) {
    return {
      success: false,
      message: "Conversation not found",
      data: null,
    };
  }

  if (
    profile.data.id !== conversationDetails.data.memberOne.id &&
    profile.data.id !== conversationDetails.data.memberTwo.id
  ) {
    return {
      success: false,
      message: "You're not a member of this conversation",
      data: null,
    };
  }

  return {
    success: true,
    message: "Success",
    data: {
      id: conversationDetails.data.id,
      block: {
        isBlocked: conversationDetails.data.isBlocked,
        blockedBy: conversationDetails.data.blockedBy,
      },
      status: {
        accepted: conversationDetails.data.invitationAccepted,
        shouldBeAcceptedBy: conversationDetails.data.memberTwo.id,
      },
      to:
        profile.data.id === conversationDetails.data.memberOne
          ? {
              name: conversationDetails.data.memberTwo.name,
              id: conversationDetails.data.memberTwo.id,
              avatar: conversationDetails.data.memberTwo.avatar,
              joinedOn: conversationDetails.data.memberTwo.created_at,
            }
          : {
              name: conversationDetails.data.memberOne.name,
              id: conversationDetails.data.memberOne.id,
              avatar: conversationDetails.data.memberOne.avatar,
              joinedOn: conversationDetails.data.memberOne.created_at,
            },
    },
  };
}
