import type { TInsertMessage } from "../../../../packages/db/src/data-access/messages/create-message.js";
import { string, z, ZodType } from "zod";

export const messageSchema: ZodType<TInsertMessage> = z.object({
  textMessage: z.string().optional(),
  fileUrl: z.string().nullable().optional(),
  inReplyTo: z
    .object({
      id: z.string(),
      content: z.string(),
      isDeleted: z.boolean(),
      sender: z.object({
        id: z.string(),
        role: z.union([
          z.literal("admin"),
          z.literal("moderator"),
          z.literal("guest"),
        ]).nullable(),
        joinedOn: z.string(),
        name: z.string(),
        avatar: z.string(),
        isBanned: z.boolean(),
        isMuted: z.boolean(),
        isKicked: z.boolean(),
        isLeft: z.boolean(),
      }),
      createdAt: z.string(),
      latEditedAt: z.string(),
      attachments: z.array(z.string()), // Change this line
      channelId: z.string(),
      inReplyTo: z.object({
        id: z.string(),
        content: z.string(),
        isDeleted: z.boolean(),
        sender: z.object({
          id: z.string(),
          role: z.union([
            z.literal("admin"),
            z.literal("moderator"),
            z.literal("guest"),
          ]).nullable(),
          joinedOn: z.string(),
          name: z.string(),
          avatar: z.string(),
          isBanned: z.boolean(),
          isMuted: z.boolean(),
          isKicked: z.boolean(),
          isLeft: z.boolean(),
        }),
        createdAt: z.string(),
        lastEditedOn: z.string(),
        attachments: z.array(z.string()), // Change this line
        channelId: z.string(),
        inReplyTo: z.null(),
      }),
      lastEditedOn: z.string(),
    })
    .nullable(),

  senderMemberDetails: z.object({
    id: z.string(),
    role: z.union([
      z.literal("admin"),
      z.literal("moderator"),
      z.literal("guest"),
    ]).nullable(),
    name: z.string(),
    avatar: z.string(),
    isBanned: z.boolean(),
    isMuted: z.boolean(),
    isKicked: z.boolean(),
    isLeft: z.boolean(),
    joinedOn: z.string(),
  }),

  channelId: z.string(),
  token: z.string(),
});