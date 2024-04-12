import { TCategory, TChannel, TServer } from "../../schema.js";
import { categoryWithChannelsDetailsDto } from "../categories/categories-detils-dto.js";
import { channelDetailsDto } from "../channel/channel-details-dto.js";

type TServerDetailsProp = TServer & {
  categories: TCategory[];
  channels: TChannel[];
};

export const serverDetailsDto = (data: TServerDetailsProp) => {
  return {
    id: data.id,
    name: data.name,
    avatar: data.avatar,
    description: data.description,
    creatorProfileId: data.creator_profile_id,
    CreatedAt: data.created_at,
    LastUpdatedAt: data.updated_at,
    isPrivate: data.is_private,
    isJoiningAllowed: data.is_joining_allowed,
    categories: data.categories.map((category) =>
      categoryWithChannelsDetailsDto({
        channels: data.channels,
        data: category,
      })
    ),
    channels: data.channels.map((channel) => channelDetailsDto(channel)),
  };
};

export type TServerDetailsDTO = ReturnType<typeof serverDetailsDto>;
