import type { TInsertMessage } from "../../../../packages/db/src/data-access/messages/create-message.js";
import { z, ZodType } from "zod";

export const messageSchema: ZodType<TInsertMessage> = z.object({
  content: z.string(),
  attachments: z.string().array(),
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
        username: z.string(),
        name: z.string(),
        avatar: z.string(),
        isBanned: z.boolean().nullable(),
        isMuted: z.boolean().nullable(),
        isKicked: z.boolean().nullable(),
        isLeft: z.boolean().nullable(),
      }),
      createdAt: z.string(),
      lastEditedOn: z.string(),
      attachments: z.array(z.string()),
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
          username: z.string(),
          isBanned: z.boolean(),
          isMuted: z.boolean(),
          isKicked: z.boolean(),
          isLeft: z.boolean(),
        }).nullable(),
        createdAt: z.string(),
        lastEditedOn: z.string(),
        attachments: z.array(z.string()),
        channelId: z.string(),
        inReplyTo: z.null(),
      }).nullable(),
    }),

  senderDetails: z.object({
    id: z.string(),
    role: z.union([
      z.literal("admin"),
      z.literal("moderator"),
      z.literal("guest"),
    ]).nullable(),
    name: z.string(),
    avatar: z.string(),
    username: z.string(),
    isBanned: z.boolean().nullable(),
    isMuted: z.boolean().nullable(),
    isKicked: z.boolean().nullable(),
    isLeft: z.boolean().nullable(),
    joinedOn: z.string(),
  }),

  channelId: z.string(),
  token: z.string(),
  type: z.union([
    z.literal("server-message"),
    z.literal("direct-message"),
  ])
});