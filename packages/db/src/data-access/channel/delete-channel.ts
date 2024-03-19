import { eq } from "drizzle-orm";
import { db } from "../../db.js";
import { Channel } from "../../schema.js";

export default async function deleteChannelOperation({
  channelId,
}: {
  channelId: string;
}) {
  try {
    await db.delete(Channel).where(eq(Channel.id, channelId));

    return {
      success: true,
      message: "Channel deleted successfully",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "An error occurred",
    };
  }
}
