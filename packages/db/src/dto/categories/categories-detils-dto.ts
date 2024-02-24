import { TCategory, TChannel } from "../../schema";
import { channelDetailsDto } from "../channel/channel-details-dto";

export const categoryWithChannelsDetailsDto = ({
  data,
  channels,
}: {
  data: TCategory;
  channels: TChannel[];
}) => {
  return {
    id: data.id,
    name: data.name,
    server_id: data.server_id,
    description: data.description,
    channels: channels
      .filter((channel) => channel.category_id === data.id)
      .map((channel) => channelDetailsDto(channel)),
  };
};

export type TCategoryWithChannelsDetailsDto = ReturnType<
  typeof categoryWithChannelsDetailsDto
>;
