"use server";

import { currentProfile } from "@/lib/auth/current-user";
import { joinServerOperation } from "@db/data-access/server/join-server";
import { redirect } from "next/navigation";
export default async function joinServerAction({
  channelId,
  serverId,
}: {
  serverId: string;
  channelId?: string;
}) {
  const profile = await currentProfile();

  if (!profile.data) {
    return {
      status: 401,
      success: false,
      message: "Unauthorized",
    };
  }

  //const res = await isMemberOfServer({ profileId: profile.data.id, serverId });

  // if (res.status !== 200) {
  //   return {
  //     status: res.status,
  //     success: false,
  //     message: res.error,
  //   };
  // }

  // if (res.status === 200 && res.isMember) {
  //   if (channelId) redirect(`/channels/${serverId}/${channelId}`);
  //   else redirect(`/channels/${serverId}`);
  // }

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

  if (joinServerRes.success) {
    if (channelId) redirect(`/channel/${serverId}/${channelId}`);
    else redirect(`/channel/${serverId}`);
    return {
      status: joinServerRes.status,
      success: true,
      message: joinServerRes.message,
    };
  }

  return {
    status: joinServerRes.status,
    success: false,
    message: joinServerRes.message,
  };
}
