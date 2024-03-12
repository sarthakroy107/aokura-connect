"use server";

import { currentProfile } from "@/lib/auth/current-user";
import { redirect } from "next/navigation";
import { isMemberOfServer } from "@db/data-access/member/check-is-member-of-server";

export default async function hasJoinedServer({serverId, channelId}: { serverId: string , channelId?: string }) {
  if (!serverId) {
    throw new Error("Server ID is required");
  }
  const profile = await currentProfile();
  if (!profile.data) {
    redirect("/login");
  }

  const res = await isMemberOfServer({ profileId: profile.data.id, serverId });

  if(!res.isMember) {
    if(channelId)
    redirect(`/join?sid=${serverId}&cid=${channelId}`);
    else
    redirect(`/join?sid=${serverId}`);
  }

  return res.isMember;
}
