'use server';
import { db } from "@/lib/index"
import { Channel, channelTypesEnum, memberToChannel } from "../schema"
import { eq } from "drizzle-orm";

export const createChannel = async (name: string, type: channelTypesEnum, serverId: string, categoryId: string, memberId: string) => {
    try {
        const newChannel = await db.insert(Channel).values({ name, channel_type: type, server_id: serverId, category_id: categoryId, creator_member_id: memberId }).returning();
        await db.insert(memberToChannel).values({ channel_id: newChannel[0].id, member_id: memberId });
        return newChannel[0].id;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getChannelById = async (id: string) => {
    try {
        const channel = await db.select({ id: Channel.id, name: Channel.name, type: Channel.channel_type }).from(Channel).where(eq(Channel.id, id))
        if(channel.length == 0) throw new Error("Channel not found");
        return channel[0];
    } catch (error) {
        console.error(error);
        return null;
    }
}