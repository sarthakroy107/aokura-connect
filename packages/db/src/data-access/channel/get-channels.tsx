import { eq } from "drizzle-orm";
import { db } from "../../db.js";
import { Channel } from "../../schema.js";

export default async function getChannelsOperation(serverId: string) {
  try {
    const channels = await db
      .select({
        id: Channel.id,
        name: Channel.name,
        isPrivate: Channel.is_private,
        serverId: Channel.server_id,
        type: Channel.channel_type,
      })
      .from(Channel)
      .where(eq(Channel.server_id, serverId));

    return {
      success: true as const,
      data: channels,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false as const,
      error: `Internal server error: ${error}`,
    };
  }
}
