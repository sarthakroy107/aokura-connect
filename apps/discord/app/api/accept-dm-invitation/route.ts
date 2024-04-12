import acceptedInvitation from "@/lib/server-actions/conversation/accept-invitation";
import { NextResponse, NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
  const { conversationId } = await req.json();
  await acceptedInvitation(conversationId);
  return new NextResponse(null, { status: 200 });
}
