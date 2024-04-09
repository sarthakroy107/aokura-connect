import { and, eq } from "drizzle-orm";
import { db } from "../../db.js";
import { Channel, Member, memberToChannel } from "../../schema.js";
import joinChannelOperation from "../channel/join-channel.js";

export type TValidMemberDetailsProps = {
  profileId: string;
  memberId: string;
  channelId: string;
  serverId: string;
};

export const validMemberDetails = async ({
  profileId,
  memberId,
  serverId,
  channelId,
}: TValidMemberDetailsProps) => {
  console.log("Checking member details");
  console.table({ profileId, memberId, serverId, channelId });
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
