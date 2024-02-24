import { TProfile } from "../../schema";

export const profileDto = (data: TProfile) => {
  return {
    id: data.id,
    usernaeme: data.username,
    email: data.email,
    name: data.name,
    avatar: data.avatar,
    is_email_verified: data.is_email_verified,
    is_deleted: data.is_deleted,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};

export type TProfileDTO = ReturnType<typeof profileDto>;

