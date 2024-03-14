"use server";

import { currentProfile } from "@/lib/auth/current-user";

export const createInvitationLinkAction = async ({}: {serverId: string}) => {
  const profile = await currentProfile();

  if (!profile.data || profile.status !== 200) return {
    status: 400,
    success: false,
    message: "Profile details not found",
  };
};
