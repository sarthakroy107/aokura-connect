import { NextRequest, NextResponse } from "next/server";
import {
  createInvitationLinkAction,
  type TCreateInvitationLinkProps,
} from "@/lib/server-actions/invitation-link/create-invitaion-link";

export type TAPICreateInvitationLinkReturn =
  | {
      token: string;
      message: string;
    }
export async function POST(req: NextRequest) {
  const body: TCreateInvitationLinkProps = await req.json();
  const res = await createInvitationLinkAction(body);
  if (res.status !== 200 || !res.data) {
    return new NextResponse(JSON.stringify({ error: res.message }), {
      status: res.status,
    });
  }

  return new NextResponse(
    JSON.stringify(res.data satisfies TAPICreateInvitationLinkReturn),
    { status: 200 }
  );
}
