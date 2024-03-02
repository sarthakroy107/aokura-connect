import { TMessageBodyDto } from "@repo/db/src/dto/messages/message-dto.js";
import { TInsertMessage } from "@repo/db/src/data-access/messages/create-message.js";
import { formatDate } from "./formate-date.js";

export const formateNewChatMessage = (
  data: TInsertMessage
): TMessageBodyDto => {
  return {
    id: crypto.randomUUID(),
    text_content: data.textMessage ?? "",
    file_url: data.fileUrl ?? "",
    is_deleted: false,
    channel_id: data.channelId,
    in_reply_to: null,
    sender: {
      nickname: data.senderMemberDetails.nickname,
      avatar: data.senderMemberDetails.avatar ?? "",
      id: data.senderMemberDetails.id,
      role: data.senderMemberDetails.role,
      is_banned: data.senderMemberDetails.is_banned,
      is_muted: data.senderMemberDetails.is_muted,
      is_kicked: data.senderMemberDetails.is_kicked,
      is_left: data.senderMemberDetails.is_left,
    },
    created_at: formatDate(new Date().toISOString()),
    updated_at: formatDate(new Date().toISOString()),
  };
};
