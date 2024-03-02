import { db } from "../../db.js";
import { TMessageBodyDto, TMessageSenderDto, TReplingToMessageDto } from "../../dto/messages/message-dto.js";
import { Message } from "../../schema";

export type TInsertMessage = {
  textMessage?: string |undefined;
  fileUrl?: string | null | undefined;
  inReplyTo: null | TReplingToMessageDto

  senderMemberDetails: TMessageSenderDto;

  channelId: string;
  token: string;
};

export const insertMessage = async (data: TMessageBodyDto) => {
  try {
    await db.insert(Message).values({
      sender_member_id: data.sender.id,
      channel_id: data.channel_id,
      file_url: data.file_url,
      in_reply_to: data.in_reply_to?.id ?? null,
      content: data.text_content,
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
