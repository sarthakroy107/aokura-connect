import { and, eq } from "drizzle-orm";
import { db } from "../../db.js";
import { Member, Server } from "../../schema.js";

export async function joinServerOperation({
  serverId,
  profile,
}: {
  serverId: string;
  profile: {
    id: string;
    name: string;
    avatar: string;
  };
}) {
  try {
    return await db.transaction(async (trx) => {
      const member = await trx.query.Member.findFirst({
        where: and(
          eq(Member.profile_id, profile.id),
          eq(Member.server_id, serverId)
        ),
      });

      if (member) {
        return {
          status: 200 as const,
          success: true as const,
          message: "Already joined",
          memberId: member.id,
        };
      }

      const server = trx.query.Server.findFirst({
        where: eq(Server.id, serverId),
      });

      if (!server) {
        return {
          status: 400 as const,
          success: false as const,
          message: "Server not found",
          memberId: null,
        };
      }

      const newMember = await trx
        .insert(Member)
        .values({
          profile_id: profile.id,
          server_id: serverId,
          role: "guest",
          nickname: profile.name,
          avatar: profile.avatar,
        })
        .returning();

      if (!newMember || !newMember[0]) {
        return {
          status: 500 as const,
          success: false as const,
          message: "Internal Server Error",
          memberId: null,
        };
      }
      return {
        status: 200 as const,
        success: true as const,
        message: "Joined successfully",
        memberId: newMember[0].id,
      };
    });
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      success: false,
      message: "Internal Server Error - joinServerOperation",
      memberId: null,
    };
  }
}
