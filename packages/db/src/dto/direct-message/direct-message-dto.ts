import { TDirectMessage, TProfile } from "../../schema.js";
import { formatDate } from "../messages/date-formater.js";
import type { TSenderBody } from "../messages/sender.js";

type TChatDirectMessageData = TDirectMessage & {
  sender: TProfile;
  in_reply_to: (TDirectMessage & { sender: TProfile }) | null;
};

export const messageBodyDto = (data: TChatDirectMessageData) => {
  return {
    id: data.id,
    content: data.content,
    attachmemts: data.attachments,
    isDeleted: data.isDeleted,
    channelId: data.conversationId,
    sender: senderDto(data.sender),

    inReplyTo: !data.in_reply_to
      ? null
      : replingToMessageDto(data.in_reply_to),

    createdAt: formatDate(data.createdAt),
    updatedAt: formatDate(data.createdAt),
  };
};

const replingToMessageDto = (data: TDirectMessage & { sender: TProfile }) => {
  return {
    id: data.id,
    text_content: data.content,
    isDeleted: null,
    sender: senderDto(data.sender),
    createdAt: formatDate(data.createdAt),
    updatedAt: formatDate(data.updatedAt),
  };
};

const senderDto = (data: TProfile): TSenderBody => {
  return {
    id: data.id,
    role: null,
    name: data.name,
    avatar: data.avatar ?? "",
    isBanned: null,
    isMuted: null,
    isKicked: null,
    isLeft: null,
    joinedOn: data.created_at,
  };
};

export type TReplingToDirectMessageDto = ReturnType<typeof replingToMessageDto>;

export type TDirectMessageSenderDto = ReturnType<typeof senderDto>;

export type TDirectMessageBodyDto = ReturnType<typeof messageBodyDto>;
