import { TMessageBodyDto } from "../../../../packages/db/src/dto/messages/message-dto.js";
import { TInsertMessage } from "../../../../packages/db/src/data-access/messages/create-message.js";
import { formatDate } from "../../../../packages/db/src/dto/messages/date-formater.js";

export const formateNewChatMessage = (
  data: TInsertMessage
): TMessageBodyDto => {
  formatDate(new Date().toISOString());
  return {
    id: crypto.randomUUID(),
    content: data.content ?? "",
    attachments: data.attachments,
    isDeleted: false,
    channelId: data.channelId,
    inReplyTo: null,
    sender: {
      joinedOn: data.senderMemberDetails.joinedOn,
      name: data.senderMemberDetails.name,
      avatar: data.senderMemberDetails.avatar ?? "",
      id: data.senderMemberDetails.id,
      role: data.senderMemberDetails.role,
      isBanned: data.senderMemberDetails.isBanned,
      isMuted: data.senderMemberDetails.isMuted,
      isKicked: data.senderMemberDetails.isKicked,
      isLeft: data.senderMemberDetails.isLeft,
    },
    createdAt: new Date().toISOString(),
    lastEditedOn: new Date().toISOString(),
  };
};
