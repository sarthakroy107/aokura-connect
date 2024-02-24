import { eq } from "drizzle-orm";
import { db } from "../../db";
import { Server } from "../../schema";
import { serverDetailsDto } from "../../dto/server/server-details-dto";

export const getServerDetails = async (serverId: string) => {
  try {
    const server = await db.query.Server.findFirst({
      where: eq(Server.id, serverId),
      with: {
        categories: true,
        channels: true,
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
