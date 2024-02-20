"use server";

import { and, eq, sql } from "drizzle-orm";
import { db } from "@db/db";
import { Category, Channel, Member, Server, memberToChannel } from "@db/schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { redirect } from "next/navigation";
import { serverFormSchema } from "./validator";

const getCurrentServerData = z.object({
  serverId: z.string().min(1, { message: "Server ID is required" }),
  profileId: z.string().min(1, { message: "Profile ID is required" }),
});

//*************** GET ***************//

export const getServers = async (profileId: string) => {
  try {
    const servers = await db.query.Member.findMany({
      columns: {
        server_id: true,
      },
      where: eq(Member.profile_id, profileId),
      with: { server: { columns: { avatar: true, name: true, id: true } } },
    });

    return servers;
  } catch (error) {
    console.error(error);
  }
};

export const seacrhPublicServer = async (searchQuery: string) => {
  const result = z
    .string()
    .min(1, { message: "String can not be empty" })
    .safeParse(searchQuery);

  if (!result.success) return [];

  try {
    const servers = await db
      .select()
      .from(Server)
      .where(
        sql`to_tsvector('simple', ${Server.name}) @@ to_tsquery('simple', ${searchQuery})`
      );

    if (!servers) return [];

    return servers;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getServerAndMemberDetails = async (
  serverId: string,
  profileId: string
) => {
  const result = getCurrentServerData.safeParse({ serverId, profileId });

  if (!result.success) {
    throw new Error(result.error.message);
  }

  try {
    return await db.transaction(async (tx) => {
      const server = await tx
        .select()
        .from(Server)
        .where(eq(Server.id, serverId));
      console.log({ server });
      if (!server || !server[0]) throw new Error("Server not found");

      const member = await tx
        .select()
        .from(Member)
        .where(
          and(
            eq(Member.server_id, server[0].id),
            eq(Member.profile_id, profileId)
          )
        );

      if (!member || !member[0]) return;

      const categories = await tx.query.Category.findMany({
        where: eq(Category.server_id, server[0].id),
        with: {
          channels: {
            columns: {
              id: true,
              name: true,
              is_private: true,
              channel_type: true,
              category_id: true,
              creator_member_id: true,
            },
          },
        },
      });

      if (!memberToChannel) throw new Error("Server not found");

      const channel_members = await tx.query.memberToChannel.findMany({
        where: eq(memberToChannel.member_id, member[0].id),
      });

      categories.forEach((category) => {
        category.channels.filter(
          (channel) =>
            channel.is_private === false ||
            channel_members.find(
              (channel_member) => channel_member.channel_id === channel.id
            )
        );
      });

      return {
        server: server[0],
        member: member[0],
        categories,
      };
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

//***** POST *****/

export const createServer = async (
  name: string,
  avatar: string,
  profileId: string
) => {
  console.table({ name, avatar, profileId });
  try {
    const server_id = await db.transaction(async (trx) => {
      const newServer = await trx
        .insert(Server)
        .values({
          name,
          avatar,
          invitation_code: crypto.randomUUID(),
          creator_profile_id: profileId,
        })
        .returning();
      if (!newServer || !newServer[0]) trx.rollback();

      const newMember = await trx
        .insert(Member)
        .values({
          profile_id: profileId,
          server_id: newServer[0]!.id,
          role: "admin",
        })
        .returning();
      if (!newMember || !newMember[0]) trx.rollback();

      const newCategory = await trx
        .insert(Category)
        .values({
          name: "General",
          server_id: newServer[0]!.id,
          creator_member_id: newMember[0]!.id,
        })
        .returning();
      if (!newCategory || !newCategory[0]) trx.rollback();

      const newChannel = await trx
        .insert(Channel)
        .values({
          name: "Welcome",
          category_id: newCategory[0]!.id,
          creator_member_id: newMember[0]!.id,
          server_id: newServer[0]!.id,
          channel_type: "text",
        })
        .returning();
      if (!newChannel || !newChannel[0]) trx.rollback();

      await trx
        .insert(memberToChannel)
        .values({ member_id: newMember[0]!.id, channel_id: newChannel[0]!.id })
        .returning();
      console.log(newServer[0]!.id);
      return newServer[0]!.id;
    });
    revalidatePath("/(main)/channel/[serverId]");
    return server_id;
  } catch (error) {
    console.error(error);
  }
};

export const joinServer = async (serverIds: string[], profileId: string) => {
  let lastJoined;
  for (const serverId of serverIds) {
    try {
      const alreadyJoined = await checkAlreadyJoined(serverId, profileId);
      if (alreadyJoined) continue;
      await db
        .insert(Member)
        .values({ server_id: serverId, profile_id: profileId, role: "guest" });
      lastJoined = serverId;
    } catch (error) {
      console.error(error);
    }
  }
  revalidatePath("/(main)/channel/[serverId]");
  redirect(`/channel/${lastJoined}`);
};

const checkAlreadyJoined = async (serverId: string, profileId: string) => {
  try {
    const member = await db.query.Member.findFirst({
      where: and(
        eq(Member.server_id, serverId),
        eq(Member.profile_id, profileId)
      ),
    });

    if (!member) return false;
    else return true;
  } catch (error) {
    console.error(error);
  }
};

//***** PUT *****/

type TServerDetailsForm = {
  serverDetails: Omit<TDBServer, "created_at" | "updated_at" | "id">;
  serverId: string;
};

export const updateServerDetails = async (data: TServerDetailsForm) => {
  try {
    serverFormSchema.parse(data.serverDetails);
    if(!data.serverId) throw new Error("Server ID is required");
    await db
      .update(Server)
      .set(data.serverDetails)
      .where(eq(Server.id, data.serverId));
    return { status: "success", message: "Server details updated" };
  } catch (error) {
    console.error(error);
    throw new Error("Error updating server details");
  }
};
