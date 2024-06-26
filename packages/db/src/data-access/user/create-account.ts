import { and, eq } from "drizzle-orm";
import { db } from "../../db.js";
import { Profile } from "../../schema.js";
import { getAnimeGirlImage } from "../../fun/get-anime-girl-image.js";

type TCreateAccount = {
  name: string;
  email: string;
  password: string;
  username: string;
  dateOfBirth: string;
};

export const createProfile = async (data: TCreateAccount) => {
  try {
    return await db.transaction(async (trx) => {
      const checkEmailAvailibility = await trx // Check if email is already in use
        .select()
        .from(Profile)
        .where(
          and(
            eq(Profile.email, data.email),
            eq(Profile.is_deleted, false),
            eq(Profile.is_email_verified, true)
          )
        );

      if (checkEmailAvailibility && checkEmailAvailibility.length > 0) {
        // Check if email is already in use
        return {
          success: false,
          status: 400,
          message: "User already exists",
          data: null,
        };
      }

      const checkUsernameAvailibility = await trx // Check if username is already in use
        .select()
        .from(Profile)
        .where(
          and(
            eq(Profile.username, data.username),
            eq(Profile.is_deleted, false),
            eq(Profile.is_email_verified, true)
          )
        );

      if (checkUsernameAvailibility && checkUsernameAvailibility.length > 0) {
        // Check if username is already in use
        return {
          success: false,
          status: 400,
          message: "User already exists",
          data: null,
        };
      }

      const newUser = await trx
        .insert(Profile)
        .values({
          // Create a new user
          name: data.name,
          avatar: getAnimeGirlImage(), // Get a random anime girl image
          email: data.email,
          password: data.password,
          username: data.username,
          date_of_birth: data.dateOfBirth,
        })
        .returning();

      return {
        success: true,
        status: 200,
        message: "User created successfully",
        data: newUser[0],
      };
    });
  } catch (error) {
    console.error(error);
    return {
      success: false,
      status: 500,
      message: "An error occurred while creating user",
      data: null,
    };
  }
};
