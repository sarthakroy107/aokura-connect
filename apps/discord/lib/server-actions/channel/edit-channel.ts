"use server";

import { currentProfile } from "@/lib/auth/current-user";
import { getMemberDetails } from "@db/data-access/member/get-member-details";
import EditChannelOperation from "@db/data-access/channel/edit-channel";

export async function EditChannelAction({
  channelId,
  channelName,
  isBlocked,
  isPrivate,
  serverId,
}: {
  channelId: string;
  channelName: string;
  isBlocked: boolean;
  isPrivate: boolean;
  serverId: string;
}) {
  if (!channelId || !channelName || typeof isPrivate !== "boolean") {
    return {
      status: 400,
      success: false,
      message: "Invalid input",
      data: null,
    };
  }

  const profile = await currentProfile();

  if (!profile.data || profile.status !== 200) {
    return {
      status: 401,
      success: false,
      message: "Unauthorized",
      data: null,
    };
  }

  const member = await getMemberDetails({
    serverId,
    profileId: profile.data.id,
  });

  if (member.status !== 200 || !member.data) {
    return {
      status: 401,
      success: false,
      message: "Unauthorized, Member details not found",
      data: null,
    };
  }

  if (member.data.role === "guest") {
    return {
      status: 403,
      success: false,
      message: "Forbidden",
      data: null,
    };
  }

  const modifyChannelOperationRes = await EditChannelOperation({
    channelId,
    channelName,
    isBlocked,
    isPrivate,
  });

  if (modifyChannelOperationRes.success) {
    return {
      status: 200,
      success: true,
      message: "Channel updated successfully",
      data: null,
    };
  } else {
    return {
      status: 500,
      success: false,
      message: "Internal server error",
      data: null,
    };
  }
}
