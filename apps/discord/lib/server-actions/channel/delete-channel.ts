"use server";

import { currentProfile } from "@/lib/auth/current-user";
import { getMemberDetails } from "@db/data-access/member/get-member-details";
import deleteChannelOperation from "@db/data-access/channel/delete-channel";

export default async function deleteChannelAction({
  channelId,
  serverId,
}: {
  channelId: string;
  serverId: string;
}) {
  if (!channelId)
    return {
      status: 400,
      success: false,
      message: "Channel id is required",
    };

  if (!serverId)
    return {
      status: 400,
      success: false,
      message: "Server id is required",
    };

  const profile = await currentProfile();

  if (profile.status !== 200 || !profile.data)
    return {
      status: 401,
      success: false,
      message: "Unauthorized",
    };

  const member = await getMemberDetails({
    profileId: profile.data.id,
    serverId,
  });

  console.table(member);

  if (member.status !== 200 || !member.data)
    return {
      status: 403,
      success: false,
      message: "Forbidden, member details not found",
    };

  if (member.data.role === "guest")
    return {
      status: 403,
      success: false,
      message: "Forbidden",
    };

  const operation = await deleteChannelOperation({ channelId });

  if (!operation.success) {
    return {
      status: 500,
      success: false,
      message: operation.message,
    };
  }

  return {
    status: 200 as const,
    success: true as const,
    message: operation.message,
  };
}
