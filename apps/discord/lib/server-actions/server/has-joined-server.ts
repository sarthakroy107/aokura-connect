"use server";

import { currentProfile } from "@/lib/auth/current-user";
import { redirect } from "next/navigation";
import { isMemberOfServer } from "@db/data-access/member/check-is-member-of-server";

export default async function hasJoinedServer({
  serverId,
  channelId,
}: {
  serverId: string;
  channelId?: string;
}) {
  if (!serverId) {
    throw new Error("Server ID is required");
  }
  const profile = await currentProfile();
  if (!profile.data) {
    redirect("/login");
    return undefined;
  }

  const res = await isMemberOfServer({ profileId: profile.data.id, serverId });

  if (res.isMember === false) {
    return false;
  } else if (res.isMember === undefined) {
    return false;
  }

  return res.isMember;
}
