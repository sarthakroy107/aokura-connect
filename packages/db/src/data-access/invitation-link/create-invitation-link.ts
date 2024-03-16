import { nanoid } from "nanoid";
import { db } from "../../db.js";
import { InviteToken } from "../../schema.js";

type TProps = {
  validity: Date | null;
  maxUsers: number | null;
  creatorMemberId: string;
  serverId: string;
  channelId: string | null;
};

export default async function createInvitationLink({
  creatorMemberId,
  maxUsers,
  validity,
  serverId,
  channelId,
}: TProps) {
  const token = nanoid(10);
  try {
    await db.insert(InviteToken).values({
      creator_member_id: creatorMemberId,
      server_id: serverId,
      token,
      expiration: validity,
      channel_id: channelId,
      has_limit: maxUsers !== null,
      is_active: true,
      limit: maxUsers,
    });
    return token;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating invitation link");
  }
}
