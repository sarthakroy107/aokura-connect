"use server";

import { auth } from "@/auth";
import { db } from "@db/db";
import { eq } from "drizzle-orm";
import { Profile } from "@db/schema";

export const currentProfile = async () => {
  const data = await auth();

  if (
    !data ||
    !data.user ||
    !data.user.id ||
    !data.user.email ||
    !data.user.name
  )
    return null;
  const profile = await db
    .select()
    .from(Profile)
    .where(eq(Profile.next_auth_user_id, data?.user?.id));

  if (profile.length === 0) {
    const newProfile = await db
      .insert(Profile)
      .values({
        next_auth_user_id: data.user.id,
        username: data.user.name,
        name: data.user.name,
        email: data.user.email,
        avatar: data.user.image,
      })
      .returning();

    if (!newProfile || !newProfile[0]) return null;

    return newProfile[0];
  }

  return profile[0];
};
