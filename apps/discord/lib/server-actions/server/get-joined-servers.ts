"use server";
import { currentProfile } from "@/lib/auth/current-user";
import { getJoinedServers } from "@db/data-access/server/get-joined-server";

export const getProfileJoinedServers = async () => {

  const profile = await currentProfile();

  if (profile.status !== 200 || !profile.data)
    return {
      status: profile.status,
      success: false,
      message: profile.message,
    };

  const res = await getJoinedServers(profile.data.id);
  if (res.status !== 200 || !res.data)
    return {
      status: res.status,
      success: false,
      message: res.message,
    };

  return {
    status: 200 as const,
    success: true as const,
    message: "Profile servers fetched successfully",
    servers: res.data,
    profile: profile.data,
  };
};
