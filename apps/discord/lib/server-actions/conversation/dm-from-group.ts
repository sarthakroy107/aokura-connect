"use server";

import { currentProfile } from "@/lib/auth/current-user";

export default async function dmFromServerChannelAction({
  receiverUserId,
}: {
  receiverUserId: string;
}) {
  try {
    const profile = await currentProfile();
    if (!profile.data || profile.status !== 200) {
      return {
        success: false,
        status: 401,
        error: "Unauthorized",
      };
    }

    

  } catch (error) {
    console.error(error);
    return {
      success: false,
      error,
    };
  }
}
