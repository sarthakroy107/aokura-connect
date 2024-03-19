import { eq } from "drizzle-orm";
import { db } from "../../db.js";
import { Channel } from "../../schema.js";

export async function changeChannelStatusOperation({
  newState,
  channelId,
}: {
  newState: boolean;
  channelId: string;
}) {
  try {
    await db
      .update(Channel)
      .set({ is_blocked: newState })
      .where(eq(Channel.id, channelId));
    return {
      success: true,
      message: "Channel blocked successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error,
    };
  }
}
