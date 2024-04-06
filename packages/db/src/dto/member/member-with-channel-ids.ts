import { TMember, TProfile } from "../../schema.js";

type TMemberWithChannelIdsProp = TMember & {
  channels: {
    channel_id: string;
    id?: string;
    member_id?: string;
  }[];
  profile: TProfile | null
};

export const memberWithChannelIdsDto = (data: TMemberWithChannelIdsProp) => {
  return {
    id: data.id,
    name: data.nickname || "",
    avatar: data.server_avatar || "",
    serverId: data.server_id,
    profile_id: data.profile_id,
    role: data.role,
    isBanned: data.is_banned,
    isLeft: data.is_left,
    isKicked: data.is_kicked,
    isMuted: data.is_muted,
    joinedOn: data.profile?.created_at || "",
    severJoinedOn: data.created_at,
    channels: data.channels.map((channel) => channel.channel_id),
  };
};

export type TMemberWithChannelIds = ReturnType<typeof memberWithChannelIdsDto>;
