// "use server";

// import { count, desc, eq } from "drizzle-orm";
// import { db } from "@db/db";
// import { Message } from "@db/schema";
// import { messageBodyDto } from "@db/dto/messages/message-dto";

// const MESSAGE_BATCH = 10;

// export const createMessage = async (
//   content: string,
//   file_url: string,
//   sender_member_id: string,
//   channel_id: string
// ) => {
//   try {
//     const newMessage = await db
//       .insert(Message)
//       .values({ content, attachments, sender_member_id, channel_id })
//       .returning();

//     return newMessage[0];
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };

// export const getMessages = async (channel_id: string, skip?: number , batchSize?: number) => {

//   try {
//     const messages = await db.query.Message.findMany({
//       where: eq(Message.channel_id, channel_id),
//       offset: !skip ? 0: skip,
//       limit: batchSize ?? MESSAGE_BATCH,
//       orderBy: desc(Message.created_at),
//       with: {
//         sender: {
//           with: {
//             profile: true,
//           },
//         },
//         in_reply_to: true,
//       },
//     });

//     const totalMessagesCount = await db.select({ value: count()}).from(Message).where(eq(Message.channel_id, channel_id));

//     const transformedMessages = messages.map((message) =>
//       messageBodyDto(message)
//     );

//     return {
//       messages: transformedMessages,
//       skip: (!skip ? 0 : skip ) + (batchSize ?? MESSAGE_BATCH),
//       total: totalMessagesCount[0]?.value ?? 0
//     };
//   } catch (error) {
//     console.log(error);
//     throw new Error("Error fetching messages");
//   }
// };
