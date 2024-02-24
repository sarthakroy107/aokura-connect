"use server";

import { auth } from "@/auth";
import { db } from "@db/db";
import { eq } from "drizzle-orm";
import { Profile } from "@db/schema";
import { redirect } from "next/navigation";

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
    .where(eq(Profile.email, data?.user?.email));

  if (profile.length === 0) {
    
    redirect("/register");
    return null;
  }

  return profile[0];
};
