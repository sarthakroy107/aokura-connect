import { TMember, TMessage, TProfile } from "../../schema";
import { formatDate } from "./date-formater";

type TChatMessageData = TMessage & {
  sender: TMember & {
    profile?: TProfile;
  };
  in_reply_to: (TMessage & { sender: TMember & { profile?: TProfile } }) | null;
};

export const messageBodyDto = (data: TChatMessageData) => {
  return {
    id: data.id,
    text_content: data.content,
    file_url: data.file_url,
    is_deleted: data.is_deleted,
    channel_id: data.channel_id,
    sender: senderDto(data.sender),

    in_reply_to: !data.in_reply_to
      ? null
      : replingToMessageDto(data.in_reply_to),

    created_at: formatDate(data.created_at),
    updated_at: formatDate(data.updated_at),
  };
};

const replingToMessageDto = (
  data: TMessage & { sender: TMember & { profile?: TProfile } }
) => {
  return {
    id: data.id,
    text_content: data.content,
    is_deleted: data.is_deleted,
    sender: senderDto(data.sender),
    created_at: formatDate(data.created_at),
    updated_at: formatDate(data.updated_at),
  };
};

const senderDto = (data: TMember & { profile?: TProfile }) => {
  return {
    id: data.id,
    role: data.role,
    nickname: data.nickname ?? data.profile?.name ?? "",
    avatar: data.server_avatar ?? data.profile?.avatar ?? "",
    is_banned: data.is_banned,
    is_muted: data.is_muted,
    is_kicked: data.is_kicked,
    is_left: data.is_left,
  };
};

export type TReplingToMessageDto = ReturnType<typeof replingToMessageDto>;

export type TMessageSenderDto = ReturnType<typeof senderDto>;

export type TMessageBodyDto = ReturnType<typeof messageBodyDto>;