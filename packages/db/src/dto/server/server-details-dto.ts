import { TCategory, TChannel, TServer } from "../../schema";
import { categoryWithChannelsDetailsDto } from "../categories/categories-detils-dto";
import { channelDetailsDto } from "../channel/channel-details-dto";

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
    categories: data.categories.map((category) => categoryWithChannelsDetailsDto({ channels: data.channels, data: category})),
    channels: data.channels.map((channel) => channelDetailsDto(channel)),
  };
};

export type TServerDetailsDto = ReturnType<typeof serverDetailsDto>;
