import { eq } from "drizzle-orm";
import { db } from "../../db.js";
import { Member } from "../../schema.js";
import { TServerDetailsDto } from "../../dto/server/server-details-dto.js";

export const getJoinedServers = async (profileId: string) => {
  try {

    const servers = await db.query.Member.findMany({
      where: eq(Member.profile_id, profileId),
      with: { server: true },
    });

    const transformedServerDetails: Omit<TServerDetailsDto, 'categories' | 'channels'>[] = servers.map(
      (data) => {
        return {
          id: data.server.id,
          name: data.server.name,
          avatar: data.server.avatar,
          description: data.server.description,
          creatorProfileId: data.server.creator_profile_id,
          CreatedAt: data.server.created_at,
          LastUpdatedAt: data.server.updated_at,
          isPrivate: data.server.is_private,
          isJoiningAllowed: data.server.is_joining_allowed,
        };
      }
    );

    return {
      status: 200 as const,
      success: true as const,
      message: "Server details fetched successfully",
      data: transformedServerDetails,
    };

  } catch (error) {
    console.error(error);
    return {
      status: 500,
      success: false,
      message: "Internal Server Error - getJoinedServers",
    };
  }
};
