import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { Member, memberToChannel } from "../../schema";

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
    if (!channel) return false;

    return true;

  } catch (error) {
    console.error(error);
    return false;
  }
};
