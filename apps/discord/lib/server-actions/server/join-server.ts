"use server";

import { currentProfile } from "@/lib/auth/current-user";
import joinChannelOperation from "@db/data-access/channel/join-channel";
import { joinServerOperation } from "@db/data-access/server/join-server";
import { redirect } from "next/navigation";
export default async function joinServerAction({
  channelId,
  serverId,
}: {
  serverId: string;
  channelId?: string;
}) {

  if (!serverId) {
    return {
      status: 400,
      success: false,
      message: "Bad Request, serverId is required",
    };
  }

  const profile = await currentProfile();

  if (!profile.data) {
    return {
      status: 401,
      success: false,
      message: "Unauthorized",
    };
  }

  //console.log("Before Join Server Res");

  const joinServerRes = await joinServerOperation({
    profile: {
      id: profile.data.id,
      name: profile.data.name,
      avatar:
        profile.data.avatar ||
        "https://i.postimg.cc/pTc0GmjJ/naruto-uzumaki-retro-black-background-amoled-minimal-art-5120x2880-6502.jpg",
    },
    serverId,
  });

  if (joinServerRes.status !== 200 || !joinServerRes.memberId) {
    return {
      status: joinServerRes.status,
      success: false,
      message: joinServerRes.message,
    };
  }

  if (!channelId) {
    return {
      status: joinServerRes.status,
      success: true,
      message: joinServerRes.message,
    };
  }
  
  //console.log("Before Join Channel Res");

  const joinChannelRes = await joinChannelOperation({
    channelId,
    memberId: joinServerRes.memberId,
  });

  if (!joinChannelRes.success || !joinChannelRes.joined) {
    return {
      status: 400,
      success: false,
      message: joinChannelRes.message,
    };
  }

  redirect(`/channel/${serverId}/${channelId}`);

  return {
    status: 200,
    success: true,
    message: "Joined successfully",
  };
}
