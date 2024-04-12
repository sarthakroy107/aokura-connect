import joinServerAction from "@/lib/server-actions/server/join-server";
import { NextRequest, NextResponse } from "next/server";

export type TAPIJoinServerResponse = {
  joined: boolean;
  message: string;
};

export async function PUT(req: NextRequest) {
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
