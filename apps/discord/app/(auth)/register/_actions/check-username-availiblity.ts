
"use server";

import { db } from "@db/db";
import { Profile } from "@db/schema";
import { eq } from "drizzle-orm";

export const checkUsernameAvailibility = async (username: string) => {
  try {
    const result = await db
      .select()
      .from(Profile)
      .where(eq(Profile.username, username));
    if (!result || result.length === 0) {
      return {
        available: true,
        username,
        message: "Username is available",
      };
    } else
      return {
        available: false,
        username,
        message: "Username is already taken",
      };
  } catch (error) {
    console.error(error);
    return {
      available: false,
      username,
      message: "An error occurred while checking username availability",
    };
  }
};