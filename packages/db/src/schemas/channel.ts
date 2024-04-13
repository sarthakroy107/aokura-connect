import { z, ZodType } from "zod";
import { TCreateChannelDBProps } from "../data-access/channel/create-channel.js";

export const createChannelSchema: ZodType<TCreateChannelDBProps> = z.object({
  name: z
    .string()
    .min(1, { message: "Name is rquired" })
    .max(32, { message: "Name must be less than 16 characters" }),
  type: z.enum(["text", "voice"]),
  memberId: z.string(),
  serverId: z.string(),
  categoryId: z.string(),
});

export const modifyChannelSchema = z.object({
  channelId: z.string().min(1, { message: "Channel ID is required" }),
  channelName: z.string().min(1, { message: "Channel name is required" }),
  isBlocked: z.boolean(),
  isPrivate: z.boolean(),
  serverId: z.string().min(1, { message: "Server ID is required" }),
});

export const deleteChannelSchema = z.object({
  channelId: z.string().min(1, { message: "Channel ID is required" }),
  serverId: z.string().min(1, { message: "Server ID is required" }),
});