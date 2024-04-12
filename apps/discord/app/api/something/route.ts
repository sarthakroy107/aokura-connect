import getConversationDetails from "@/app/(protected)/channel/me/[channelId]/_actions/get-conversation-details";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const json = await req.json();

  const res = await getConversationDetails(json.channelId);

  return new NextResponse(JSON.stringify(res), {
    status: 200,
  });
}
