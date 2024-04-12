import { checkUsernameAvailibility } from "@/app/(auth)/register/_actions/check-username-availiblity";
import { NextRequest, NextResponse } from "next/server";

export type TAPIRegisterUserResponse =
  | {
      error: string;
    }
  | {
      error: null;
      available: boolean;
      username: string;
      message: string;
    };

export async function PUT(req: NextRequest) {
  const body = await req.json();
  if (!body)
    return new NextResponse(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
    });
  const res = await checkUsernameAvailibility(body);

  return new NextResponse(
    JSON.stringify({
      available: res.available,
      username: res.username,
      message: res.message,
      error: null,
    } satisfies TAPIRegisterUserResponse),
    {
      status: 200,
    }
  );
}
