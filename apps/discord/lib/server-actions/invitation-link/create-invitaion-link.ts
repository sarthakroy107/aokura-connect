"use server";

import { currentProfile } from "@/lib/auth/current-user";
import {
  type TNewInvitationLink,
  newInvitationLinkSchema,
} from "@/lib/validations/invitation-link/new-invitation-link";
import { getMemberDetails } from "@db/data-access/member/get-member-details";
import invitationLinkDataFormatter from "./format-invitation-configuration";
import createInvitationLink from "@db/data-access/invitation-link/create-invitation-link";

export type TCreateInvitationLinkProps = {
  serverId: string;
  channelId: string | null;
  data: TNewInvitationLink;
}

export const createInvitationLinkAction = async ({
  serverId,
  channelId,
  data,
}: {
  serverId: string;
  channelId: string | null;
  data: TNewInvitationLink;
}) => {
  const profile = await currentProfile();
  const result = newInvitationLinkSchema.safeParse(data);

  if (!result.success) {
    return {
      status: 400,
      success: false,
      message: "Invalid data",
    };
  }

  if (!profile.data || profile.status !== 200)
    return {
      status: 400,
      success: false,
      message: "Profile details not found",
    };

  const member = await getMemberDetails({
    serverId: serverId,
    profileId: profile.data.id,
  });

  if (!member.data || member.status !== 200) {
    return {
      status: 403,
      success: false,
      message: "Member not found",
    };
  }

  if (member.data.role === "guest") {
    return {
      status: 403,
      success: false,
      message: "Guests are not allowed to create invitation links",
    };
  }

  const formattedData = invitationLinkDataFormatter(data);

  let token: string;
  try {
    token = await createInvitationLink({
      creatorMemberId: member.data.id,
      serverId,
      maxUsers: formattedData.maxUsers,
      validity: formattedData.expDate,
      channelId,
    });
  } catch (error) {
    return {
      status: 500,
      success: false,
      message: "Error while creating invitation link",
    }
  }

  return {
    status: 200,
    success: true,
    data: {
      token,
      message: `Link valid for next ${data.validity.replaceAll("-", " ")}`,
    },
  };
};
