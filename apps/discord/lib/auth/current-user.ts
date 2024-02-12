"use server";
import { auth } from "@clerk/nextjs";
import { db } from "@db/db";
import { eq } from "drizzle-orm";
import { Profile } from "@/lib/schema";
import { currentUser } from "@clerk/nextjs";

export const currentProfile = async () => {
  const { userId } = auth();
  if (!userId) return null;

  const profile = await db
    .select()
    .from(Profile)
    .where(eq(Profile.clerk_user_id, userId));
  if (profile && profile[0]) return profile[0];

  const data = await currentUser();

  if (!data) return null;

  const newProfile = await db
    .insert(Profile)
    .values({
      clerk_user_id: userId!,
      username: data?.username!,
      name: data?.firstName + " " + data?.lastName,
      email: data?.emailAddresses[0]!.emailAddress,
      phone: data?.phoneNumbers[0]!.phoneNumber,
    })
    .returning();

  if (newProfile && newProfile[0]) return newProfile[0];

  return null;
};
