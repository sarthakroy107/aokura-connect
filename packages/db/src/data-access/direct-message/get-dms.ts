import { count, desc, eq } from "drizzle-orm";
import { db } from "../../db.js";
import { DirectMessage } from "../../schema.js";
import { directMessaageDTO } from "../../dto/direct-message/direct-message-dto.js";

const MESSAGE_BATCH = 20;

export default async function getDirectMessagesOperation(
  conversationId: string,
  skip: number | undefined,
  batchSize: number | undefined
) {
  if(!conversationId) throw new Error("No conversationId provided");
  try {
    // console.table({ conversationId, skip, batchSize });
    const dms = await db.query.DirectMessage.findMany({
      where: eq(DirectMessage.conversationId, conversationId),
      offset: !skip ? 0 : skip,
      limit: batchSize ?? MESSAGE_BATCH,
      orderBy: desc(DirectMessage.createdAt),
      with: {
        sender: true,
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

    return {
      messages: dms.map((dm) => directMessaageDTO(dm)),
      skip: (!skip ? 0 : skip) + (batchSize ?? MESSAGE_BATCH),
      total: totalDirectMessagesCount[0]?.value ?? 0,
    };
  } catch (error) {
    console.log(error);
    return {
      messages: [],
      skip: 0,
      total: 0,
    };
  }
}
