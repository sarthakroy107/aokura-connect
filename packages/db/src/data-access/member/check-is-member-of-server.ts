import { and, eq } from "drizzle-orm";
import { db } from "../../db.js";
import { Member } from "../../schema.js";

export async function isMemberOfServer({
  profileId,
  serverId,
}: {
  serverId: string;
  profileId: string;
}) {
  try {
    const member = await db
      .select()
      .from(Member)
      .where(
        and(eq(Member.profile_id, profileId), eq(Member.server_id, serverId))
      );
    if (!member)
      return {
        status: 200 as const,
        success: true as const,
        isMember: false,
      };
    else
      return {
        status: 200 as const,
        success: true as const,
        isMember: true,
      };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      success: false,
      error: `Error in DB while checking if member is part of server: ${error}`,
    };
  }
}
