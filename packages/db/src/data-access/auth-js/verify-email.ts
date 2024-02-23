import { and, eq, gte } from "drizzle-orm";
import { db } from "../../db";
import { EmailActivationTokenTable, Profile } from "../../schema";

export const checkToken = async (token: string) => {
  try {
    const time = new Date(Date.now()).toISOString();
    const res = await db.query.EmailActivationTokenTable.findFirst({
      where: and(
        eq(EmailActivationTokenTable.token, token),
        gte(EmailActivationTokenTable.exipration_time, time)
      ),
      with: {
        profile: true,
      },
    });

    if (!res) {
      return {
        status: 400,
        success: true, //True becouse db operation is succesfull
        message: "Not a valid token",
      };
    }
    if (res.used) {
      return {
        status: 406,
        success: true, //True becouse db operation is succesfull
        message: "Token already used",
      };
    }
    const updatedProfile = await db
      .update(Profile)
      .set({ is_email_verified: true })
      .where(eq(Profile.id, res.profile.id))
      .returning();

    await db
      .update(EmailActivationTokenTable)
      .set({ used: true })
      .where(eq(EmailActivationTokenTable.token, token)); //Set token as used

    if (!updatedProfile || updatedProfile.length === 0) {
      return {
        status: 500,
        success: false,
        message: "An error occurred while updating profile",
      };
    }

    return {
      status: 200 as const,
      success: true as const,
      message: "Token verified successfully",
      profile: res.profile,
    };
  } catch (error) {
    console.error(error);
    return {
      staus: 500,
      success: false,
      message: "An error occurred while checking token in DB",
    };
  }
};
