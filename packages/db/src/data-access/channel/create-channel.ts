import { db } from "../../db.js";
import { Channel, memberToChannel } from "../../schema.js";

export type TCreateChannelDBProps = {
  name: string;
  type: "text" | "voice";
  memberId: string;
  serverId: string;
  categoryId: string;
};

export async function createChannelOperation({
  name,
  memberId,
  serverId,
  categoryId,
  type,
}: TCreateChannelDBProps) {
  console.log("Creating channel");
  const newChannel = await db
    .insert(Channel)
    .values({
      name,
      channel_type: type,
      server_id: serverId,
      category_id: categoryId,
    })
    .returning();

  if (!newChannel[0]) throw new Error("Channel not created");

  db.insert(memberToChannel).values({
    channel_id: newChannel[0].id,
    member_id: memberId,
  });

  return newChannel[0].id;
}
