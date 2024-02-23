"use server";

import bcrypt from "bcrypt";
import { registrationFormSchema } from "@/lib/validations/auth-schemas";
import { z } from "zod";
import { toISOString } from "@/lib/validations/data-string-check";
import { createProfile } from "@db/data-access/user/create-account";
import { insertEmailVerificationToken } from "@db/data-access/auth-js/insert-token";
import { sendAccountActivationEmail } from "@repo/emails/nodemailer/account-activation";


export const registerUser = async (
  data: z.infer<typeof registrationFormSchema>
) => {
  try {
    const parse = registrationFormSchema.safeParse(data); // Check if form data is valid

    if (!parse.success) {
      return {
        status: 400,
        success: false,
        message: parse.error.message,
      };
    }

    const dateOfBirth = toISOString(data.dateOfBirth); // Check if date of birth is valid

    if (!dateOfBirth.success) {
      return {
        status: 400,
        success: false,
        message: dateOfBirth.message,
      };
    }

    data.password = await bcrypt.hash(data.password, 10); // Hash the password

    // Create a new profile
    const newProfileRes = await createProfile({
      email: data.email,
      name: data.name,
      username: data.username,
      dateOfBirth: dateOfBirth.date,
      password: data.password,
    });

    if (newProfileRes.status !== 200 || !newProfileRes.data) { // Check if profile was created successfully
      return {
        status: newProfileRes.status,
        success: false,
        message: newProfileRes.message,
      };
    }

    const token = await bcrypt.hash(Date.now().toString() + data.email, 8); // Generate a token

    const tokenRes = await insertEmailVerificationToken({ // Insert the token
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

    const emaiRes = await sendAccountActivationEmail({
      accountActivationLink: `http://localhost:3000/verify-email?token=${token}`,
      receiverEmailAddress: data.email,
      receiverName: data.name,
    });
    
    if (!emaiRes.success) {
      return {
        status: 500,
        success: emaiRes.success,
        message: emaiRes.message,
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
