import { TMessageBodyDto } from "../../../../packages/db/src/dto/messages/message-dto.js";
import { TInsertMessage } from "../../../../packages/db/src/data-access/messages/create-message.js";
import { TSenderBody } from "../../../../packages/db/src/dto/messages/sender.js";

export const formateNewChatMessage = (
  data: TInsertMessage
): TMessageBodyDto & { sender: TSenderBody } => {
  
  return {
    id: crypto.randomUUID(),
    content: data.content ?? "",
    attachments: data.attachments,
    isDeleted: false,
    channelId: data.channelId,
    inReplyTo: data.inReplyTo,
    sender: {
      joinedOn: data.senderDetails.joinedOn,
      name: data.senderDetails.name,
      avatar: data.senderDetails.avatar ?? "",
      id: data.senderDetails.id,
      role: data.senderDetails.role,
      isBanned: data.senderDetails.isBanned,
      isMuted: data.senderDetails.isMuted,
      isKicked: data.senderDetails.isKicked,
      username: data.senderDetails.username,
      isLeft: data.senderDetails.isLeft,
    },
    createdAt: new Date().toISOString(),
    lastEditedOn: new Date().toISOString(),
  };
};
