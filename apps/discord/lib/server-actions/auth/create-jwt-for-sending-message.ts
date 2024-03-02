"use server";

import {
  TValidMemberDetailsProps,
  validMemberDetails,
} from "@db/data-access/member/check-is-member-of-channel";
import { encode } from "./jwt-token";
import { ZodType, z } from "zod";

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

export const createJWTForSendingMessage = async (props: TProp) => {
  try {
    schema.parse(props);

    const checkIsValid = await validMemberDetails({
      profileId: props.profileId,
      memberId: props.memberId,
      serverId: props.serverId,
      channelId: props.channelId,
    });
    

    if (!checkIsValid) {
      return {
        status: 403,
        success: false,
        error: "Invalid member details",
      };
    }

    const token = await encode({
      profileId: props.profileId,
      memberId: props.memberId,
      serverId: props.serverId,
      channelId: props.channelId,
      username: props.username,
      email: props.email,
    });

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
