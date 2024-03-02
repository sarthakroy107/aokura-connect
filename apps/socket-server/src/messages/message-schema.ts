import { TInsertMessage } from "@repo/db/src/data-access/messages/create-message";
import { string, z, ZodType } from "zod";

export const messageSchema: ZodType<TInsertMessage> = z.object({
  textMessage: z.string().optional(),
  fileUrl: z.string().nullable().optional(),
  inReplyTo: z
    .object({
      id: z.string(),
      text_content: z.string().nullable(),
      is_deleted: z.boolean(),
      sender: z.object({
        id: z.string(),
        role: z.union([
          z.literal("admin"),
          z.literal("moderator"),
          z.literal("guest"),
        ]),
        nickname: z.string(),
        avatar: z.string(),
        is_banned: z.boolean(),
        is_muted: z.boolean(),
        is_kicked: z.boolean(),
        is_left: z.boolean(),
      }),
      created_at: z.string(),
      updated_at: z.string(),
    })
    .nullable(),

  senderMemberDetails: z.object({
    id: z.string(),
    role: z.union([
      z.literal("admin"),
      z.literal("moderator"),
      z.literal("guest"),
    ]),
    nickname: z.string(),
    avatar: z.string(),
    is_banned: z.boolean(),
    is_muted: z.boolean(),
    is_kicked: z.boolean(),
    is_left: z.boolean(),
  }),
  channelId: z.string(),
  token: z.string(),
});
