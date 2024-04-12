import { currentProfile } from "@/lib/auth/current-user";
import { NextRequest, NextResponse } from "next/server";
import type { TProfileDTO } from "@db/dto/profile/profile-body-dto";
export type TAPIProfile = TProfileDTO;
export async function GET(req: NextRequest) {
  const profile = await currentProfile();
  if (profile.status !== 200 || profile.data === null) {
    return new NextResponse(JSON.stringify(null), {
      status: profile.status,
    });
  }
  return new NextResponse(JSON.stringify(profile.data satisfies TAPIProfile), {
    status: 200,
  });
}
