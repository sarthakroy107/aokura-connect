import { asc, desc, eq } from "drizzle-orm";
import { db } from "../../db.js";
import { Channel, Server } from "../../schema.js";
import { serverDetailsDto } from "../../dto/server/server-details-dto.js";

export const getServerDetails = async (serverId: string) => {
  try {
    const server = await db.query.Server.findFirst({
      where: eq(Server.id, serverId),
      orderBy: asc(Server.created_at),
      with: {
        categories: true,
        channels: {
          orderBy: asc(Channel.created_at),
        }
      },
    });
    
    if (!server)
      return {
        status: 404,
        success: false,
        error: "Server not found",
      };

    return {
      status: 200 as const,
      success: true as const,
      data: serverDetailsDto(server),
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      success: false,
      error: "Error in DB while fetching server details",
    };
  }
};
