import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { Profile } from "../../schema";
import { profileDto } from "../../dto/profile/profile-body-dto";

type ProfileStatus = {
  is_email_verified: boolean;
  is_deleted: boolean;
};

type TGetProfileProps =
  | (ProfileStatus & { email: string })
  | (ProfileStatus & { id: string })
  | (ProfileStatus & { username: string });

export const getProfile = async (data: TGetProfileProps) => {
  try {
    if ("email" in data) {
      const profile = await db
        .select()
        .from(Profile)
        .where(
          and(
            eq(Profile.email, data.email),
            eq(Profile.is_deleted, data.is_deleted),
            eq(Profile.is_email_verified, data.is_email_verified)
          )
        );
      if (!profile || profile.length === 0 || !profile[0])
        return {
          status: 404,
          success: true,
          message: "Profile not found with email",
        };

      return {
        status: 200 as const,
        success: true,
        message: "Profile found",
        data: profileDto(profile[0]),
      };
    } else if ("id" in data) {
      const profile = await db
        .select()
        .from(Profile)
        .where(
          and(
            eq(Profile.id, data.id),
            eq(Profile.is_deleted, data.is_deleted),
            eq(Profile.is_email_verified, data.is_email_verified)
          )
        );
      if (!profile || profile.length === 0 || !profile[0])
        return {
          status: 404,
          success: true,
          message: "Profile not found with id",
        };

      return {
        status: 200 as const,
        success: true,
        message: "Profile found with id",
        data: profileDto(profile[0]),
      };
    } else if ("username" in data) {
      const profile = await db
        .select()
        .from(Profile)
        .where(
          and(
            eq(Profile.username, data.username),
            eq(Profile.is_deleted, data.is_deleted),
            eq(Profile.is_email_verified, data.is_email_verified)
          )
        );
      if (!profile || profile.length === 0 || !profile[0])
        return {
          status: 404,
          success: true,
          message: "Profile not found with username",
        };

      return {
        status: 200 as const,
        success: true,
        message: "Profile found",
        data: profileDto(profile[0]),
      };
    }
    return {
      status: 400,
      success: false,
      message: "Invalid data to search profile with",
    }
  } catch (error) {
    console.error(error);
    return {
      status: 500 as const,
      success: false,
      message: "Error occured in DB while fetching profile",
      error: error,
    };
  }
};
