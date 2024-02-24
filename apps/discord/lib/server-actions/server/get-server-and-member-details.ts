"use server";

import { currentProfile } from "@/lib/auth/current-user";
import { getMemberDetails } from "@db/data-access/member/get-member-details";
import { getServerDetails } from "@db/data-access/server/get-server-full-details";
import { z } from "zod";

export const getServerAndMemberDetails = async (serverId: string) => {
  const profile = await currentProfile();
  const checkServerId = z.string().min(1, { message: "Server ID is required" });
  const result = checkServerId.safeParse(serverId);

  if (!result.success)
    return {
      status: 400,
      success: false,
      data: null,
      error: "Server ID is required",
    };

  if (!profile || profile.status !== 200 || !profile.data)
    return {
      status: profile.status,
      success: false,
      data: null,
      error: "Profile not found",
    };

  const serverData = await getServerDetails(serverId);

  if (serverData.status !== 200 || !serverData.data)
    return {
      status: serverData.status,
      success: false,
      data: null,
      error: serverData.error,
    };

  const memeberData = await getMemberDetails({
    serverId: serverData.data.id,
    profileId: profile.data.id,
  });

  if(memeberData.status !== 200 || !memeberData.data)
    return {
      status: memeberData.status,
      success: false,
      data: null,
      error: memeberData.error,
    };
  
  return {
    status: 200 as const,
    success: true as const,
    data: {
      server: serverData.data,
      member: memeberData.data,
    },

  }
};
