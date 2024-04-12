import { registerUser } from "@/app/(auth)/register/_actions/register-user";
import { registrationFormSchema } from "@/lib/validations/auth-schemas";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export type TAPIRegisterUserResponse =
  | {
      error: string;
      message: undefined;
    }
  | {
      error: undefined;
      message: string;
    };

export async function POST(req: NextRequest) {
  const data: z.infer<typeof registrationFormSchema> = await req.json();
  const res = await registerUser(data);
  if (res.status !== 200) {
    return new NextResponse(
      JSON.stringify({
        error: res.message || "Error occured",
        message: undefined,
      } satisfies TAPIRegisterUserResponse),
      {
        status: res.status,
      }
    );
  } else {
    return new NextResponse(
      JSON.stringify({
        message: "Account activation link sent to your email",
        error: undefined,
      } satisfies TAPIRegisterUserResponse),
      {
        status: 200,
      }
    );
  }
}
