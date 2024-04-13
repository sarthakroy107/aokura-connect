import dmFromServerChannelAction from "@/lib/server-actions/conversation/dm-from-group";
import { NextRequest, NextResponse } from "next/server";

export type TAPIDMFromServerReturnType = {
  message: string;
  success: boolean;
  conversationId: string | null;
};

export async function POST(req: NextRequest) {
  const { textMessage, profile } = await req.json();
  const res = await dmFromServerChannelAction({
    receiverProfileId: profile.id,
    textContent: textMessage,
  });

  if (res.status !== 200 || !res.data)
    return new NextResponse(
      JSON.stringify({
        message: (res.error as string) || "Failed to send message",
        success: false,
        conversationId: null,
      } satisfies TAPIDMFromServerReturnType),
      {
        status: res.status,
      }
    );

  return new NextResponse(
    JSON.stringify({
      message: "Message sent",
      success: true,
      conversationId: res.data.conversationId,
    } satisfies TAPIDMFromServerReturnType),
    {
      status: 200,
    }
  );
}
