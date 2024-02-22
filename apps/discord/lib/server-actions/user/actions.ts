"use server";

import bcrypt from "bcrypt";
import { db } from "@db/db";
import { Profile } from "@db/schema";
import { eq } from "drizzle-orm";
import { registrationFormSchema } from "@/lib/validations/auth-schemas";
import { z } from "zod";
import { toISOString } from "@/lib/validations/data-string-check";
import { createProfile } from "@db/data-access/user/create-account";
import { insertEmailVerificationToken } from "@db/data-access/auth-js/insert-token";
import { sendAccountActivationEmail } from "@repo/emails/nodemailer/account-activation";
import { AcoountActivationEmail } from "@repo/emails/emails/account-activation";

//**************GET****************//
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

//**************POST****************//

export const registerUser = async (
  data: z.infer<typeof registrationFormSchema>
) => {
  try {
    const parse = registrationFormSchema.safeParse(data);

    if (!parse.success) {
      return {
        status: 400,
        success: false,
        message: parse.error.message,
      };
    }

    const dateOfBirth = toISOString(data.dateOfBirth);

    if (!dateOfBirth.success) {
      return {
        status: 400,
        success: false,
        message: dateOfBirth.message,
      };
    }

    data.password = await bcrypt.hash(data.password, 10);

    const newProfileRes = await createProfile({
      email: data.email,
      name: data.name,
      username: data.username,
      dateOfBirth: dateOfBirth.date,
      password: data.password,
    });

    if (newProfileRes.status !== 200 || !newProfileRes.data) {
      return {
        status: newProfileRes.status,
        success: false,
        message: newProfileRes.message,
      };
    }

    const token = await bcrypt.hash(Date.now().toString() + data.email, 8);

    const tokenRes = await insertEmailVerificationToken({
      token,
      profileId: newProfileRes.data?.id,
    });

    if (!tokenRes.success) {
      return {
        status: 500,
        success: tokenRes.success,
        message: tokenRes.message,
      };
    }

    try {
      const emaiRes = await sendAccountActivationEmail({
        accountActivationLink: `http://localhost:3000/verify-email/?token=${token}`,
        receiverEmailAddress: data.email,
        receiverName: data.name,
      });

      console.table({ emaiRes });
    } catch (error) {
      console.error(error);

      return {
        status: 500,
        success: false,
        message: "An error occurred while sending account activation email",
      };
    }

    return {
      status: 200,
      success: true,
      message: "User registered successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      success: false,
      message: "An error occurred while registering user",
    };
  }
};
