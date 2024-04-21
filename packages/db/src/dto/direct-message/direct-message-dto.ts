import { TDirectMessage, TProfile } from "../../schema.js";
import type { TGenericMessageBody, TSenderBody } from "../messages/sender.js";

type TChatDirectMessageData = TDirectMessage & {
  sender: TProfile;
  in_reply_to: (TDirectMessage & { sender: TProfile }) | null;
};

export const directMessaageDTO = (data: TChatDirectMessageData): TGenericMessageBody => {
  return {
    id: data.id,
    content: data.content || "",
    attachments: data.attachments || [],
    isDeleted: data.isDeleted,
    channelId: data.conversationId,
    sender: senderDTO(data.sender),

    inReplyTo: !data.in_reply_to
      ? null
      : replingToDirectMessageDTO(data.in_reply_to),

    createdAt: data.createdAt,
    lastEditedOn: data.createdAt,
  };
};

const replingToDirectMessageDTO = (data: TDirectMessage & { sender: TProfile }) => {
  return {
    id: data.id,
    content: data.content || "",
    attachments: [],
    isDeleted: null,
    sender: senderDTO(data.sender),
    createdAt: data.createdAt,
    lastEditedOn: data.updatedAt,
  };
};

const senderDTO = (data: TProfile): TSenderBody => {
  return {
    id: data.id,
    role: null,
    name: data.name,
    username: data.username,
    avatar: data.avatar ?? "",
    isBanned: null,
    isMuted: null,
    isKicked: null,
    isLeft: null,
    joinedOn: data.created_at,
  };
};

export type TReplingToDirectMessageDto = ReturnType<typeof replingToDirectMessageDTO>;

export type TDirectMessageSenderDto = ReturnType<typeof senderDTO>;

export type TDirectMessageBodyDto = ReturnType<typeof directMessaageDTO>;
