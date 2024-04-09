import { count, desc, eq } from "drizzle-orm";
import { db } from "../../db.js";
import { Message } from "../../schema.js";
import { messageBodyDto } from "../../dto/messages/message-dto.js";

const MESSAGE_BATCH = 10;

export const getMessages = async (
  channel_id: string,
  skip?: number,
  batchSize?: number
) => {
  try {
    const messages = await db.query.Message.findMany({
      where: eq(Message.channel_id, channel_id),
      offset: !skip ? 0 : skip,
      limit: batchSize ?? MESSAGE_BATCH,
      orderBy: desc(Message.created_at),
      with: {
        sender: {
          with: {
            profile: true,
          },
        },
        in_reply_to: {
          with: {
            sender: {
              with: {
                profile: true,
              }
            },
          },
        },
      },
    });

    const totalMessagesCount = await db
      .select({ value: count() })
      .from(Message)
      .where(eq(Message.channel_id, channel_id));

    const transformedMessages = messages.map((message) =>
      messageBodyDto(message)
    );

    return {
      messages: transformedMessages,
      skip: (!skip ? 0 : skip) + (batchSize ?? MESSAGE_BATCH),
      total: totalMessagesCount[0]?.value ?? 0,
    };
  } catch (error) {
    console.log(error);
    return {
      messages: [],
      skip: 0,
      total: 0,
    }
  }
};
