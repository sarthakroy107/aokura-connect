"use server";

import { db } from "@db/db";
import { Channel, channelTypesEnum, memberToChannel } from "@db/schema";
import { eq } from "drizzle-orm";

type TCreateChannel = {
  name: string;
  type: channelTypesEnum;
  memberId: string;
  serverId: string;
  categoryId: string;
}

export const createChannel = async (
  { name, type, memberId, serverId, categoryId }: TCreateChannel
) => {
  try {
    const newChannel = await db
      .insert(Channel)
      .values({
        name,
        channel_type: type,
        server_id: serverId,
        category_id: categoryId,
      })
      .returning();

    if (!newChannel || !newChannel[0]) throw new Error("Channel not created");

    await db
      .insert(memberToChannel)
      .values({ channel_id: newChannel[0]?.id, member_id: memberId });

    return newChannel[0].id;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getChannelById = async (id: string) => {
  try {
    const channel = await db
      .select({
        id: Channel.id,
        name: Channel.name,
        type: Channel.channel_type,
        isBlocked: Channel.is_blocked,
      })
      .from(Channel)
      .where(eq(Channel.id, id));
    if (channel.length == 0) throw new Error("Channel not found");

    return channel[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};
