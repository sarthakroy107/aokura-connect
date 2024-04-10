import { and, eq } from "drizzle-orm";
import { db } from "../../db.js";
import { Channel, Member, memberToChannel } from "../../schema.js";
import joinChannelOperation from "../channel/join-channel.js";

export type TValidMemberDetailsProps = {
  profileId: string;
  channelId: string;
  serverId: string;
};

export const validMemberDetails = async ({
  profileId,
  serverId,
  channelId,
}: TValidMemberDetailsProps) => {
  console.log("Checking member details");
  try {
    const member = await db.query.Member.findFirst({
      where: and(
        eq(Member.profile_id, profileId),
        eq(Member.server_id, serverId)
      ),
    });

    if (!member) return false;

    const channel = await db.query.memberToChannel.findFirst({
      where: and(
        eq(memberToChannel.channel_id, channelId),
        eq(memberToChannel.member_id, member.id)
      ),
    });
    if (!channel) {
      console.log("Channel not found");
      const channel = await db
        .select()
        .from(Channel)
        .where(eq(Channel.id, channelId));
      if (!channel[0] || channel[0].is_private) return false;
      else {
        const res = await joinChannelOperation({
          memberId: member.id,
          channelId,
        });
        if (res.joined) return true;
        else return false;
      }
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export async function checkIsMemberOfChannelAndGetMemberDetails({
  profileId,
  channelId,
}: {
  profileId: string;
  channelId: string;
}) {
  try {
    const channel = await db.query.Channel.findFirst({
      where: eq(Channel.id, channelId),
    });
    if (!channel) {
      return {
        success: true,
        memberDetails: null,
        hasJoinedChannel: false,
      };
    }

    const member = await db.query.Member.findFirst({
      where: and(
        eq(Member.profile_id, profileId),
        eq(Member.server_id, channel.server_id)
      ),
    });

    if (!member)
      return {
        hasJoinedChannel: false,
        memberDetails: null,
        success: true,
      };

    if (channel.is_private) {
      const channelMember = await db.query.memberToChannel.findFirst({
        where: and(
          eq(memberToChannel.channel_id, channel.id),
          eq(memberToChannel.member_id, member.id)
        ),
      });

      if (!channelMember) {
        return {
          success: true,
          memberDetails: member,
          hasJoinedChannel: false,
        };
      }
    }

    return {
      hasJoinedChannel: true,
      memberDetails: member,
      success: true as const,
    };
  } catch (error) {
    console.error(error);
    return {
      hasJoinedChannel: null,
      memberDetails: null,
      success: false as const,
    };
  }
}
