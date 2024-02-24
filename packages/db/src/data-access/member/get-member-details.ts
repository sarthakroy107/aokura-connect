import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { Member } from "../../schema";
import { memberWithChannelIdsDto } from "../../dto/member/member-with-channel-ids";

export const getMemberDetails = async ({
  serverId,
  profileId,
}: {
  serverId: string;
  profileId: string;
}) => {

  try {
    const member = await db.query.Member.findFirst({
      where: and(
        eq(Member.server_id, serverId),
        eq(Member.profile_id, profileId)
      ),
      with: {
        channels: {
          columns: {
            channel_id: true,
          }
        }
      }
    })
    if (!member) {
      return {
        status: 404,
        success: false,
        error: "Member not found",
      };
    }
    const transformedMember = memberWithChannelIdsDto(member);
    return {
      status: 200,
      success: true,
      data: transformedMember,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      success: false,
      error: `Error in DB while fetching member details: ${error}`,
    }
  }
};
