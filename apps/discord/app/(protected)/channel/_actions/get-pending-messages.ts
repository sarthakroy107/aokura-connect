"use server";

import { currentProfile } from "@/lib/auth/current-user";
import getPendingConversations from "@db/data-access/conversation/get-pending-conversations";

export default async function getPendingDMs() {
  const profile = await currentProfile();
  if (profile.data === null) {
    return {
      success: false,
      message: "Unauthorized",
      status: 401,
    };
  }

  const pendingConversations = await getPendingConversations(profile.data.id);

  if (!pendingConversations.success) {
    return {
      success: false,
      message: "Failed to get pending conversations",
      status: 500,
    };
  }

  return {
    success: true as const,
    data: pendingConversations.data,
  };
}
