import getConversationDetails from "@/app/(protected)/channel/me/[channelId]/_actions/get-conversation-details";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const json = await req.json();
  console.log(
    "---------------------------------------------------------------------------------"
  );
  console.log(json);
  const res = await getConversationDetails(json.channelId);
  console.log(res);
  console.log(
    "---------------------------------------------------------------------------------"
  );
  // const room = req.nextUrl.searchParams.get("room");
  // const username = req.nextUrl.searchParams.get("username");
  // if (!room) {
  //   return NextResponse.json(
  //     { error: 'Missing "room" query parameter' },
  //     { status: 400 }
  //   );
  // } else if (!username) {
  //   return NextResponse.json(
  //     { error: 'Missing "username" query parameter' },
  //     { status: 400 }
  //   );
  // }

  // const apiKey = process.env.LIVEKIT_API_KEY;
  // const apiSecret = process.env.LIVEKIT_API_SECRET;
  // const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  // if (!apiKey || !apiSecret || !wsUrl) {
  //   return NextResponse.json(
  //     { error: "Server misconfigured" },
  //     { status: 500 }
  //   );
  // }

  // const at = new AccessToken(apiKey, apiSecret, { identity: username });

  // at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });

  return new NextResponse(JSON.stringify(res), {
    status: 200,
  });
}
