"use server";

import { currentProfile } from "@/lib/auth/current-user";
import {
  getPendingConversations,
  getConversations,
} from "@db/data-access/conversation/get-conversations";
import { TConversation } from "@db/schema";

export default async function getDirectMessages() {
  const profile = await currentProfile();
  if (profile.data === null) {
    return {
      success: false,
      message: "Unauthorized",
      status: 401,
    };
  }

  //const pendingConversations = await getPendingConversations(profile.data.id);

  const conversationsRes = await getConversations(profile.data.id);
  console.log(conversationsRes);

  if (!conversationsRes.success || !conversationsRes.data) {
    return {
      success: false,
      message: "Failed to get pending conversations",
      status: 500,
    };
  }
  const activeConversations = conversationsRes.data
    .filter(
      (conversation) =>
        conversation.invitationAccepted === true ||
        conversation.memberOne.id === profile.data.id
    )
    .map((conversation) =>
      conversationsDTO({ data: conversation, profileId: profile.data.id })
    );

  console.log(
    "---------------------------------------------------------------"
  );

  console.log(activeConversations);

  const pendingConversations = conversationsRes.data
    .filter(
      (conversation) =>
        conversation.memberTwo.id === profile.data.id &&
        conversation.invitationAccepted === false
    )
    .map((conversation) =>
      conversationsDTO({ data: conversation, profileId: profile.data.id })
    );
  return {
    success: true as const,
    data: {
      active: activeConversations,
      pending: pendingConversations,
    },
  };
}

type TConversationDTO = TConversation & {
  memberOne: {
    id: string;
    avatar: string | null;
    name: string;
    username: string;
  } | null;
  memberTwo: {
    id: string;
    avatar: string | null;
    name: string;
    username: string;
  } | null;
};

const conversationsDTO = ({
  data,
  profileId,
}: {
  data: TConversationDTO;
  profileId: string;
}) => {
  return {
    id: data.id,
    myself: data.memberOne.id === profileId ? data.memberOne : data.memberTwo,
    other: data.memberOne.id === profileId ? data.memberTwo : data.memberOne,
    isDeleted: data.isDeleted,
    isBlocked: data.isBlocked,
    blockedBy: data.blockedBy,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

export type TConversationsDTO = ReturnType<typeof conversationsDTO>;
