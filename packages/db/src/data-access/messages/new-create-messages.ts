import { TMessageSenderDto, TReplingToMessageDto } from "../../dto/messages/message-dto.js";

export type TInsertMessage = {
  textMessage: string | null;
  fileUrl?: string | null | undefined;
  inReplyTo: null | TReplingToMessageDto

  senderMemberDetails: TMessageSenderDto;

  channelId: string;
  token: string;
};