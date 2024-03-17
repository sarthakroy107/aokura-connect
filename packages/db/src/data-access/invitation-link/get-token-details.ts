import { and, eq, gte, is, isNull, or } from "drizzle-orm";
import { db } from "../../db.js";
import { InviteToken } from "../../schema.js";

export default async function getTokenDetails(token: string) {
  try {
    const details = await db.query.InviteToken.findFirst({
      where: and(
        eq(InviteToken.token, token),
        or(
          isNull(InviteToken.expiration),
          gte(InviteToken.expiration, new Date(Date.now()))
        ),
        eq(InviteToken.is_active, true)
      ),
      with: {
        server: true,
        channel: true,
        creator: true,
      },
    });

    if (!details) {
      return {
        data: null,
        success: true,
        message: "Token not found",
      };
    }

    if(!details.server) 
      return {
        success: true,
        data: null,
        message: "Server not found",
      }

    return {
      data: {
        token: details.token,
        isActive: details.is_active,
        server: {
          name: details.server.name,
          id: details.server.id,
          avatar: details.server.avatar,
        },
        channel: details.channel
          ? {
              name: details.channel.name,
              id: details.channel.id,
              type: details.channel.channel_type,
              isPrivate: details.channel.is_private,
            }
          : null,
      },
      success: true,
      message: "Token found",
    };
  } catch (error) {
    console.error("Error in getTokenDetails", error);
    return {
      success: false,
      message: "Internal server error",
      data: null
    }
  }
}
