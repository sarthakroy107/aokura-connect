import { eq } from "drizzle-orm";
import { db } from "../../db.js";
import { Channel } from "../../schema.js";

type TEditChannelOperation = {
  channelId: string;
  channelName: string;
  isPrivate: boolean;
  isBlocked: boolean;
};

export default async function EditChannelOperation({
  channelId,
  channelName,
  isBlocked,
  isPrivate,
}: TEditChannelOperation) {
  try {
    await db
      .update(Channel)
      .set({ name: channelName, is_private: isPrivate, is_blocked: isBlocked })
      .where(eq(Channel.id, channelId));
    return {
      success: true as const,
      error: null,
    };
  } catch (error) {
    return {
      success: false as const,
      error,
    };
  }
}
