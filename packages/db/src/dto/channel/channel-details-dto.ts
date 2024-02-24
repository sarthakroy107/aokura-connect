import { TChannel } from "../../schema";

export const channelDetailsDto = (data: TChannel) => {
  return {
    id: data.id,
    name: data.name,
    type: data.channel_type,
    isPrivate: data.is_private,
    channelType: data.channel_type,
    categoryId: data.category_id,
    creatorMemberId: data.creator_member_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export type TChannelDetailsDto = ReturnType<typeof channelDetailsDto>;