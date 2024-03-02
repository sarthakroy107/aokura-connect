import { eq } from "drizzle-orm";
import { db } from "../../db";
import {
  Server,
  Category,
  Member,
  Channel,
  memberToChannel,
  Profile,
} from "../../schema";

type TCreateServer = {
  serverName: string;
  creatorProfileId: string;
  serverAvatar?: string;
  serverDescription?: string;
};

export const createServer = async (data: TCreateServer) => {
  try {
    return await db.transaction(async (trx) => {
      // Check if the creator profile exists
      const profile = await trx.query.Profile.findFirst({
        where: eq(Profile.id, data.creatorProfileId),
      });

      if (!profile) {
        return {
          status: 404,
          success: false,
          message: "Profile not found",
        };
      };

      // Create a new server
      const server = await trx
        .insert(Server)
        .values({
          name: data.serverName,
          avatar:
            data.serverAvatar ||
            "https://i.ibb.co/GQ8CTsZ/1aa7e647b894e219e42cc079d8e54e18.jpg",
          description: data.serverDescription,
          creator_profile_id: data.creatorProfileId,
        })
        .returning();

      if (!server || !server[0]) {
        // Check if server was created successfully
        trx.rollback();
        return {
          status: 500,
          success: false,
          message: "Server not created",
        };
      };

      // Create a new member for the server and make the creator an admin
      const newMember = await trx
        .insert(Member)
        .values({
          nickname: profile.name,
          server_avatar: profile.avatar,
          profile_id: data.creatorProfileId,
          server_id: server[0].id,
          role: "admin",
        })
        .returning();

      if (!newMember || !newMember[0]) {
        // Check if member was created successfully
        trx.rollback();
        return {
          status: 500,
          success: false,
          message: "Error while creating server channel",
        };
      }

      // Create a new category for the server
      const newCategory = await trx
        .insert(Category)
        .values({
          server_id: server[0].id,
          name: "General",
          creator_member_id: newMember[0].id,
        })
        .returning();

      if (!newCategory || !newCategory[0]) {
        // Check if category was created successfully
        trx.rollback();
        return {
          status: 500,
          success: false,
          message: "Error while creating server category",
        };
      }

      // Create a new channel for the server
      const newChannel = await trx
        .insert(Channel)
        .values({
          category_id: newCategory[0].id,
          name: "General",
          creator_member_id: newMember[0].id,
          channel_type: "text",
          server_id: server[0].id,
        })
        .returning();

      if (!newChannel || !newChannel[0]) {
        // Check if channel was created successfully
        trx.rollback();
        return {
          status: 500,
          success: false,
          message: "Error while creating server channel",
        };
      }

      // Join the creator to the channel
      const joinChannel = await trx
        .insert(memberToChannel)
        .values({
          member_id: newMember[0].id,
          channel_id: newChannel[0].id,
        })
        .returning();

      if (!joinChannel || !joinChannel[0]) {
        // Check if creator was joined to the channel successfully
        trx.rollback();
        return {
          status: 500,
          success: false,
          message: "Error while Joining channel",
        };
      }

      return {
        // Return the server, category, channel and member ids
        status: 200 as const,
        success: true as const,
        message: "Server created successfully",
        data: {
          serverId: server[0].id,
          categoryId: newCategory[0].id,
          channelId: newChannel[0].id,
          memberId: newMember[0].id,
        },
      };
    });
  } catch (error) {
    console.error(error);

    return {
      status: 500,
      success: false,
      message: "DB Erorr while creating server",
    };
  }
};
