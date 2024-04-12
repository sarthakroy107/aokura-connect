import { getServerAndMemberDetails } from "@/lib/server-actions/server/get-server-and-member-details";
import { NextRequest, NextResponse } from "next/server";
import type { TServerDetailsDTO } from "@db/dto/server/server-details-dto";
import type { TMemberWithChannelIdsDTO } from "@db/dto/member/member-with-channel-ids";

export type TAPIServerAndMemberDetails = {
  server: TServerDetailsDTO;
  member: TMemberWithChannelIdsDTO;
};

export async function GET(req: NextRequest) {
  const serverId = req.nextUrl.searchParams.get("server_id");

  if (!serverId)
    return new NextResponse(
      JSON.stringify({ error: "Server ID is required" }),
      { status: 400 }
    );

  const res = await getServerAndMemberDetails(serverId);

  if (res.status !== 200 || !res.data) {
    return new NextResponse(JSON.stringify({ error: res.error }), {
      status: res.status,
    });
  }

  return new NextResponse(JSON.stringify(res.data), { status: 200 });
}
