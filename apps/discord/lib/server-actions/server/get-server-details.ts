"use server";

import { currentProfile } from "@/lib/auth/current-user";
import { getServerDetails } from "@db/data-access/server/get-server-full-details";

export default async function getServerInformation(serverId: string) {

  const profile  = await currentProfile();
  if (!profile.data) {
    return {
      status: 401 as const,
      success: false as const,
      message: "Unauthorized",
    };
  }
  const server = await getServerDetails(serverId);

  if (!server || !server.data) {
    return {
      status: 404,
      success: false,
      message: "Server not found",
    };
  }

  return {
    status: 200 as const,
    success: true as const,
    data: server.data,
  };
}
