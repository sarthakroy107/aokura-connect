import { createJWTForSendingMessage } from "@/lib/server-actions/auth/create-jwt-for-sending-message";
import { NextRequest, NextResponse } from "next/server";

export type TAPIJWTToken = { token: string };

export async function GET(req: NextRequest) {
  const channelId = req.nextUrl.searchParams.get("channel_id");
  const serverId = req.nextUrl.searchParams.get("server_id");
  const type = req.nextUrl.searchParams.get("type");

  if (!channelId || !serverId || !type) {
    return new NextResponse("Missing required parameters", { status: 400 });
  }

  if (type !== "direct-message" && type !== "server-message") {
    return new NextResponse("Invalid type", { status: 400 });
  }

  const res = await createJWTForSendingMessage({
    channelId,
    serverId,
    type,
  });

  if (res.status !== 200 || res.error || !res.token) {
    return new NextResponse(null, {
      status: res.status,
    });
  }

  return new NextResponse(
    JSON.stringify({ token: res.token } satisfies TAPIJWTToken),
    {
      status: res.status,
    }
  );
}
