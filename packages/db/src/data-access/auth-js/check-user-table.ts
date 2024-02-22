import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../schema";

export const checkEmailExists = async (email: string) => {
  try {
    const result = await db.select().from(users).where(eq(users.email, email));
    if(!result || result.length === 0) {
      return {
        success: true,
        message: "User not found"
      }
    }
    else return {
      success: true,
      message: "User already exists"
    }
  } catch (error) {
    console.error(error);
  }
};
