"use server";

import { auth } from "@/auth";
import { getProfile } from "@db/data-access/user/get-profile";

export const currentProfile = async () => {
  const data = await auth();

  if (
    !data ||
    !data.user || 
    !data.user.email
  )
    return {
      status: 404,
      success: false,
      message: "User not found",
      data: null,
    };

  const res = await getProfile({
    email: data.user.email,
    is_email_verified: true,
    is_deleted: false,
  });

  if (res.status !== 200 || !res.data) {
    return {
      status: res.status,
      success: false,
      message: res.message,
      data: null,
    }
  }

  return {
    status: 200 as const,
    success: true,
    message: "Profile found",
    data: res.data,
  }
};
