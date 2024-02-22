import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { Profile } from "../../schema";

export const checkEmailAvailibility = async (email: string) => {
  try {
    const result = await db
      .select()
      .from(Profile)
      .where(and(eq(Profile.email, email), eq(Profile.is_deleted, false), eq(Profile.is_email_verified, true)));

    if (!result || result.length === 0) {
      return {
        success: true,
        emailAvailible: true,
        message: "User not found",
      };
    } else
      return {
        success: true,
        emailAvailible: false,
        message: "User already exists",
      };

  } catch (error) {
    console.error(error);
    return {
      success: false,
      emailAvailible: false,
      message: "An error occurred while checking email availability",
    };
  }
};
