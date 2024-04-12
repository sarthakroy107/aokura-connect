import { eq } from "drizzle-orm";
import { db } from "../../db.js";
import { Profile } from "../../schema.js";

export async function isUsernameAvailable(username: string) {
  try {
    const result = await db
      .select()
      .from(Profile)
      .where(eq(Profile.username, username));
    if (result.length === 0) return true;
    else return false;
  } catch (error) {
    console.error(error);
    return null;
  }
}