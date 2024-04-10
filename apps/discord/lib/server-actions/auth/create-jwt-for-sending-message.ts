"use server";

import {
  TValidMemberDetailsProps,
  validMemberDetails,
} from "@db/data-access/member/check-is-member-of-channel";
import { encode } from "./jwt-token";
import { ZodType, z } from "zod";
import { currentProfile } from "@/lib/auth/current-user";

type TProp = TValidMemberDetailsProps & {
  username: string;
  email: string;
};

const schema: ZodType<TProp> = z.object({
  profileId: z.string(),
  memberId: z.string(),
  serverId: z.string(),
  channelId: z.string(),
  username: z.string(),
  email: z.string(),
});

export const createJWTForSendingMessage = async ({
  channelId,
  serverId,
  type,
}: {
  channelId: string;
  serverId: string | undefined;
  type: "direct-message" | "server-message";
}) => {
  try {
    const profileRes = await currentProfile();
    if (!profileRes || !profileRes.data) {
      return {
        status: 403,
        success: false,
        error: "Profile not found",
      };
    }
    // schema.parse(props);

    let token: string;

    if (type === "server-message") {
      if(!serverId) throw new Error("Server ID is required for server message");
      const checkIsValid = await validMemberDetails({
        profileId: profileRes.data.id,
        serverId: serverId,
        channelId: channelId,
      });
      if (!checkIsValid) {
        console.log("Invalid member details");
        return {
          status: 403,
          success: false,
          error: "Invalid member details",
        };
      }
    }

    token = await encode({
      id: profileRes.data.id,
      email: profileRes.data.email,
      username: profileRes.data.usernaeme,
    });

    console.log(`Token created for member channel for ${type} with channel ID: ${channelId}`);
    console.log(token);

    return {
      status: 200 as const,
      success: true as const,
      token,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      success: false,
      error: `Error in creating JWT for member channel: ${error}`,
    };
  }
};
