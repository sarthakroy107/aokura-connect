"use server";

import { currentProfile } from "@/lib/auth/current-user";
import getCoversationDetailsOperation from "@db/data-access/direct-message/get-conversation-details";

export default async function getProfileDetailsAction({
  conversationId,
}: {
  conversationId: string;
}) {
  const profile = await currentProfile();

  if (profile.status !== 200 || !profile.data) {
    return {
      status: profile.status,
      success: false,
      message: profile.message,
      data: null,
    };
  }
  const conversationDetails = await getCoversationDetailsOperation({
    conversationId,
  });

  return profile;
}
