import { currentProfile } from "@/lib/auth/current-user";
import joinServerAction from "@/lib/server-actions/server/join-server";
import { isMemberOfServer } from "@db/data-access/member/check-is-member-of-server";
import { deleteMember } from "@db/data-access/member/delete-member";
import { NextRequest, NextResponse } from "next/server";

export type TAPIJoinServerResponse = {
  joined: boolean;
  message: string;
};

//*---------------------POST---------------------*//

export async function POST(req: NextRequest) {
  const { serverId, channelId } = await req.json();
  const res = await joinServerAction({ serverId, channelId });

  if (res.status !== 200) {
    return new NextResponse(
      JSON.stringify({
        joined: false,
        message: res.message,
      } satisfies TAPIJoinServerResponse),
      { status: res.status }
    );
  } else
    return new NextResponse(
      JSON.stringify({
        joined: true,
        message: res.message,
      } satisfies TAPIJoinServerResponse),
      { status: 200 }
    );
}

//*---------------------DELETE---------------------*//

export type TAPILeaveServerResponse = {
  message: string;
};

export async function DELETE(req: NextRequest) {
  const serverId = req.nextUrl.searchParams.get("server_id");

  if (!serverId) {
    return new NextResponse(
      JSON.stringify({
        joined: false,
        message: "Member ID is missing",
      } satisfies TAPIJoinServerResponse),
      { status: 400 }
    );
  }

  const profile = await currentProfile();

  if (profile.status !== 200 || !profile.data) {
    return new NextResponse(
      JSON.stringify({
        message: "Unauthorized: Not logged in",
      } satisfies TAPILeaveServerResponse),
      { status: 401 }
    );
  }

  const member = await isMemberOfServer({
    profileId: profile.data.id,
    serverId,
  });

  if (member.status !== 200 || !member.memberDetails) {
    return new NextResponse(
      JSON.stringify({
        message: "Member not found",
      } satisfies TAPILeaveServerResponse),
      {
        status: 404,
      }
    );
  }

  const job = await deleteMember({ memberId: member.memberDetails.id });

  if (job.status !== 200) {
    return new NextResponse(
      JSON.stringify({
        message: "Internal Server Error: Deletation failed",
      } satisfies TAPILeaveServerResponse),
      { status: 500 }
    );
  }

  return new NextResponse(
    JSON.stringify({
      message: "Left server successfully",
    } satisfies TAPILeaveServerResponse),
    { status: 200 }
  );
}
