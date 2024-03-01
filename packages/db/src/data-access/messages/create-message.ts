import { db } from "../../db.js";
import { Message } from "../../schema";

export type TInsertMessage = {
  messageData: {
    textMessage?: string | null | undefined;
    fileUrl?: string | null | undefined;
    inReplyTo?: string | null | undefined;
    memberId: string;
  };
  channelId: string;
};

export const insertMessage = async (data: TInsertMessage) => {
  try {
    const newMessaage = await db.insert(Message).values({
      channel_id: data.channelId,
      sender_member_id: data.messageData.memberId,
      file_url: data.messageData.fileUrl,
      in_reply_to: data.messageData.inReplyTo,
      content: data.messageData.textMessage
    }).returning();
  } catch (error) {

  }
}