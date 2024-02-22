import { db } from "../../db";
import { EmailActivationTokenTable } from "../../schema";

type TToken = {
  token: string;
  profileId: string;
};
export const insertEmailVerificationToken = async ({
  token,
  profileId,
}: TToken) => {
  try {
    await db.insert(EmailActivationTokenTable).values({
      token,
      profile_id: profileId,
      exipration_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    });

    return {
      success: true,
      message: "Token inserted successfully",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "An error occurred while inserting token in DB",
    };
  }
};
