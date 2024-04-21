"use server";

import { getProfile } from "@db/data-access/user/get-profile";

export async function getProfileFromAuthUserAction({
  authUserEmail,
}: {
  authUserEmail: string;
}) {
  const profile = await getProfile({
    email: authUserEmail,
    is_deleted: false,
    is_email_verified: true,
  });

  if (profile.status !== 200 || !profile.data) {
    return null;
  }

  return profile.data;
}
