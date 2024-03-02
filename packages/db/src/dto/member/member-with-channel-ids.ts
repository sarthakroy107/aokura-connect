import { TMember } from "../../schema";
type TMemberWithChannelIdsProp = TMember & {
  channels: {
    channel_id: string;
    id?: string;
    member_id?: string;
  }[];
};

export const memberWithChannelIdsDto = (data: TMemberWithChannelIdsProp) => {
  return {
    id: data.id,
    nickname: data.nickname || "",
    avatar: data.server_avatar || "",
    server_id: data.server_id,
    profile_id: data.profile_id,
    role: data.role,
    is_banned: data.is_banned,
    is_left: data.is_left,
    is_kicked: data.is_kicked,
    is_muted: data.is_muted,
    channels: data.channels.map((channel) => channel.channel_id),
  };
};

export type TMemberWithChannelIds = ReturnType<typeof memberWithChannelIdsDto>;
