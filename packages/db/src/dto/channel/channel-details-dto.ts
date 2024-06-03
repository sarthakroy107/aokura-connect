import { TChannel } from "../../schema.js";

export const channelDetailsDto = (data: TChannel) => {
  return {
    id: data.id,
    name: data.name,
    type: data.channel_type,
    isPrivate: data.is_private,
    isBlocked: data.is_blocked,
    channelType: data.channel_type,
    categoryId: data.category_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export type TChannelDetailsDto = ReturnType<typeof channelDetailsDto>;