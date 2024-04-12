import { NextRequest, NextResponse } from "next/server";
import {
  getSavedMessages,
  type TGetSavedMessagesProps,
  TGetSavedMessagesReturnType,
} from "@/lib/server-actions/message/get-messages";
import { currentProfile } from "@/lib/auth/current-user";

export type TPOSTMessages =
  | TGetSavedMessagesReturnType
  | { error: string; messages: undefined };

export async function PUT(req: NextRequest) {
  const { id, type, batchSize, skip }: TGetSavedMessagesProps =
    await req.json();

  const profile = await currentProfile();

  if (!profile || !profile.data) {
    return new NextResponse(JSON.stringify({ error: "User not found" }), {
      status: 404,
    });
  }

  const messages = await getSavedMessages({
    id,
    type,
    batchSize,
    skip,
  });

  return new NextResponse(JSON.stringify(messages), {
    status: 200,
  });
}
