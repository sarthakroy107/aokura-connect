import { db } from "../../db.js";
import { TMessageBodyDto } from "../../dto/messages/message-dto.js";
import { Message } from "../../schema.js";

export const insertMessage = async (data: TMessageBodyDto) => {
  try {
    if(!data.sender) return false;
    await db.insert(Message).values({
      id: data.id,
      sender_member_id: data.sender.id, // This is the memeber id of the sender
      channel_id: data.channelId,
      attachments: data.attachments,
      in_reply_to: data.inReplyTo?.id ?? null,
      content: data.content,
      created_at: data.createdAt,
      updated_at: data.lastEditedOn,
      is_deleted: false,
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
