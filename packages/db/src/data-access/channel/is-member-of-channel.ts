import { and, eq } from "drizzle-orm";
import { db } from "../../db.js";
import { Channel, memberToChannel } from "../../schema.js";

export async function isMemberOfChannel({
  channelId,
  memberId,
}: {
  channelId: string;
  memberId: string;
}) {
  try {
    const channel = await db
      .select()
      .from(Channel)
      .where(eq(Channel.id, channelId));

    if (!channel || !channel[0])
      return { isMember: false, message: "Channel not found" };

    if (!channel[0].is_private) {
      return { isMember: true, message: "Channel is public" };
    }

    const isMemberOfPrivateChannel = await db
      .select()
      .from(memberToChannel)
      .where(
        and(
          eq(memberToChannel.channel_id, channelId),
          eq(memberToChannel.member_id, memberId)
        )
      );

    if (!isMemberOfPrivateChannel || !isMemberOfPrivateChannel[0])
      return {
        isMember: false,
        message: "User not a member of private channel",
      };

    return { isMember: true, message: "User is a member of private channel" };
  } catch (error) {
    console.error(error);
    return {
      isMember: false,
      message: "Error checking if user is a member of channel",
    };
  }
}
