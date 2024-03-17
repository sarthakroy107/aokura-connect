import { and, eq } from "drizzle-orm";
import { db } from "../../db.js";
import { Channel, memberToChannel } from "../../schema.js";

export default async function joinChannelOperation({
  channelId,
  memberId,
}: {
  channelId: string;
  memberId: string;
}) {
  try {
    console.log("In Join Channel Operation");
    return await db.transaction(async (trx) => {
      const isPrivate = await db.query.Channel.findFirst({
        where: eq(Channel.id, channelId),
        columns: {
          is_private: true,
        },
      });

      if (!isPrivate) {
        return {
          success: false,
          message: "Channel not found",
          joined: false,
        };
      }

      if (!isPrivate.is_private) {
        return {
          success: true,
          message: "Channel Public, no need to join",
          joined: true,
        };
      }

      const relation = await db.query.memberToChannel.findFirst({
        where: and(
          eq(memberToChannel.channel_id, channelId),
          eq(memberToChannel.member_id, memberId)
        ),
      });

      if (relation) {
        return { success: true, message: "Already joined", joined: true };
      }

      await db
        .insert(memberToChannel)
        .values({ channel_id: channelId, member_id: memberId });
      return { success: true, message: "Joined", joined: true };
    });
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Internal server error",
      joined: false,
    };
  }
}
