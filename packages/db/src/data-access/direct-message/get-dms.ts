import { count, desc, eq } from "drizzle-orm";
import { db } from "../../db.js";
import { Conversation, DirectMessage } from "../../schema.js";
const MESSAGE_BATCH = 20;

export default async function getDMsOperations(
  conversationId: string,
  skip: number,
  batchSize: number
) {
  const dms = await db.query.Message.findMany({
    where: eq(Conversation.id, conversationId),
    offset: !skip ? 0 : skip,
    limit: batchSize ?? MESSAGE_BATCH,
    orderBy: desc(Conversation.createdAt),
    with: {
      sender: {
        with: {
          profile: true,
        },
      },
      in_reply_to: {
        with: {
          sender: true,
        },
      },
    },
  });

  const totalDirectMessagesCount = await db
    .select({ value: count() })
    .from(DirectMessage)
    .where(eq(DirectMessage.conversationId, conversationId));
  
}
