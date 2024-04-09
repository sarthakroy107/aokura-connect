import { TMember, TMessage, TProfile } from "../../schema.js";
import { formatDate } from "./date-formater.js";
import type { TGenericMessageBody, TSenderBody } from "./sender.js";

type TChatMessageData = TMessage & {
  sender: TMember & {
    profile: TProfile;
  };
  in_reply_to: (TMessage & { sender: TMember & { profile: TProfile } }) | null;
};

export const messageBodyDto = (data: TChatMessageData): TGenericMessageBody => {
  return {
    id: data.id,
    content: data.content ?? "",
    attachments: data.attachments ?? [],
    isDeleted: data.is_deleted,
    channelId: data.channel_id,
    sender:
      (data.sender && data.sender.profile && senderDto(data.sender)) || null,

    inReplyTo: !data.in_reply_to ? null : replingToMessageDto(data.in_reply_to),

    createdAt: formatDate(data.created_at),
    lastEditedOn: formatDate(data.updated_at),
  };
};

const replingToMessageDto = (
  data: TMessage & { sender: TMember & { profile: TProfile } }
): TGenericMessageBody => {
  return {
    id: data.id,
    content: data.content ?? "",
    attachments: [],
    channelId: data.channel_id,
    isDeleted: data.is_deleted,
    sender:
      (data.sender && data.sender.profile && senderDto(data.sender)) || null,
    inReplyTo: null,
    createdAt: formatDate(data.created_at),
    lastEditedOn: formatDate(data.updated_at),
  };
};

const senderDto = (data: TMember & { profile: TProfile }): TSenderBody => {
  return {
    id: data.profile.id,
    role: data.role,
    name: data.nickname ?? data.profile.name ?? "",
    avatar: data.server_avatar ?? data.profile.avatar ?? "",
    isBanned: data.is_banned,
    isMuted: data.is_muted,
    isKicked: data.is_kicked,
    isLeft: data.is_left,
    joinedOn: data.created_at,
  };
};

export type TReplingToMessageDto = ReturnType<typeof replingToMessageDto>;

export type TMessageSenderDto = ReturnType<typeof senderDto>;

export type TMessageBodyDto = ReturnType<typeof messageBodyDto>;
