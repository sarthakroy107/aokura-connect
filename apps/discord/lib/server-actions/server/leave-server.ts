"use server";

import { currentProfile } from "@/lib/auth/current-user";
import { isMemberOfServer } from "@db/data-access/member/check-is-member-of-server";
import { deleteMember } from "@db/data-access/member/delete-member";

export default async function leaveServerAction({
  serverId,
}: {
  serverId: string;
}) {
  if (!serverId) {
    return {
      status: 400,
      message: "Bad Request, serverId is required",
      success: false,
    };
  }

  const profile = await currentProfile();

  if (profile.status !== 200 || !profile.data) {
    return {
      status: 401,
      message: "Unauthorized",
      success: false,
    };
  }

  const member = await isMemberOfServer({
    profileId: profile.data.id,
    serverId,
  });

  if (member.status !== 200 || !member.memberDetails) {
    return {
      status: 404,
      message: "Member not found",
      success: false,
    };
  }

  const job = await deleteMember({ memberId: member.memberDetails.id });

  if (job.status !== 200) {
    return {
      status: 500,
      message: "Internal Server Error",
      success: false,
    };
  }

  return {
    status: 200,
    message: "Left server successfully",
    success: true,
  };
}
