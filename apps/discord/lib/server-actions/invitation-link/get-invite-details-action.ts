'use server';
import getTokenDetails from "@db/data-access/invitation-link/get-token-details";
import { isMemberOfServer } from "@db/data-access/member/check-is-member-of-server";
import joinChannelOperation from "@db/data-access/channel/join-channel";
import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/auth/current-user";

export default async function getInviteDetailsAction(token: string) {
  if (!token)
    return {
      status: 400,
      success: false,
      data: null,
      message: "Invalid token",
    };

  const details = await getTokenDetails(token);

  if (!details.data)
    return {
      status: details.success ? 404 : 500,
      success: false,
      message: details.message,
    };
  if (!details.data.server)
    return {
      status: 404,
      success: false,
      message: "Server details not found",
    };

  const profile = await currentProfile();

  if (!profile.data || profile.status !== 200)
    return {
      status: 403,
      success: false,
      message: "Profile details not found",
    };

  const member = await isMemberOfServer({
    profileId: profile.data.id,
    serverId: details.data.server.id,
  });

  if (member.status !== 200 || !member.isMember || !member.memberDetails)
    return {
      status: 200,
      success: true,
      data: details.data,
    };

  if (!details.data.channel)
    return {
      status: 200,
      success: true,
      data: details.data,
    };

  if (member.memberDetails && !details.data.channel.isPrivate) {
    redirect(`/channel/${details.data.server.id}/${details.data.channel.id}`);
    return {
      status: 403,
      success: true,
      data: details.data,
    };
  }

  const joinChannelResult = await joinChannelOperation({
    channelId: details.data.channel.id,
    memberId: member.memberDetails.id,
  });

  if (!joinChannelResult.success)
    return {
      status: 500,
      success: false,
      message: "Internal server error",
    };

  if (joinChannelResult.joined) {
    redirect(`/channel/${details.data.server.id}/${details.data.channel.id}`);
    return {
      status: 200,
      success: true,
      data: details.data,
    };
  }

  return {
    status: 200,
    success: true,
    data: details.data,
  };
}
