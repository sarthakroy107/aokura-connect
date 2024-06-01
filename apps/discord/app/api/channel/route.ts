import { NextRequest, NextResponse } from "next/server";
import { createChannelOperation } from "@db/data-access/channel/create-channel";
import { currentProfile } from "@/lib/auth/current-user";
import { getMemberDetails } from "@db/data-access/member/get-member-details";
import EditChannelOperation from "@db/data-access/channel/edit-channel";
import deleteChannelOperation from "@db/data-access/channel/delete-channel";
import {
  createChannelSchema,
  modifyChannelSchema,
  deleteChannelSchema,
} from "@db/schemas/channel";

//*---------------------POST---------------------*//


export type TAPICreateChannelResponse =
  | {
      channelId: string;
    }
  | { error: string };

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = createChannelSchema.safeParse(body);
  if (result.success === false) {
    return new NextResponse(
      JSON.stringify({
        error: result.error.message,
      } satisfies TAPICreateChannelResponse),
      { status: 500 }
    );
  }

  try {
    const dbRes = await createChannelOperation(result.data);
    return new NextResponse(
      JSON.stringify({ channelId: dbRes } satisfies TAPICreateChannelResponse),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error as string }, { status: 500 });
  }
}

//*---------------------PUT---------------------*//

export type TAPIEditChannelResponse = { message: string };

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const result = modifyChannelSchema.safeParse(body);
  if (result.success === false)
    return new NextResponse(
      JSON.stringify({
        message: `Invalid request: ${result.error.errors.map((e) => `${e.path}: ${e.message}`).join(" | ")}`,
      } satisfies TAPIEditChannelResponse),
      { status: 400 }
    );

  const profile = await currentProfile();

  if (!profile.data || profile.status !== 200) {
    return new NextResponse(
      JSON.stringify({
        message: "Unauthorized: Not logged in",
      } as TAPIEditChannelResponse),
      { status: 401 }
    );
  }

  const member = await getMemberDetails({
    serverId: result.data.serverId,
    profileId: profile.data.id,
  });

  if (member.status !== 200 || !member.data) {
    return new NextResponse(
      JSON.stringify({ error: "Unauthorized: Member details not found" }),
      { status: 401 }
    );
  }

  if (member.data.role === "guest") {
    return new NextResponse(
      JSON.stringify({ error: "Forbidden: Guest role" }),
      { status: 403 }
    );
  }

  const modifyChannelOperationRes = await EditChannelOperation({
    channelId: result.data.channelId,
    channelName: result.data.channelName,
    isBlocked: result.data.isBlocked,
    isPrivate: result.data.isPrivate,
  });

  if (modifyChannelOperationRes.success)
    return new NextResponse(JSON.stringify({ message: "Channel modified" }), {
      status: 200,
    });
  else
    return new NextResponse(
      JSON.stringify({ error: modifyChannelOperationRes.error }),
      { status: 500 }
    );
}

//*---------------------DELETE---------------------*//

export type TAPIDeleteChannelResponse = { message: string };

export async function DELETE(req: NextRequest) {
  const channelId = req.nextUrl.searchParams.get("channel_id");
  const serverId = req.nextUrl.searchParams.get("server_id");

  const result = deleteChannelSchema.safeParse({ channelId, serverId });

  if (result.success === false)
    return new NextResponse(
      JSON.stringify({
        message: `Invalid request: ${result.error.errors.map((e) => `${e.path}: ${e.message}`).join(" | ")}`,
      } satisfies TAPIDeleteChannelResponse),
      { status: 400 }
    );

  const profile = await currentProfile();

  if (profile.status !== 200 || !profile.data)
    return new NextResponse(
      JSON.stringify({ message: "Unauthorized: User not logged in" }),
      { status: 401 }
    );

  const member = await getMemberDetails({
    profileId: profile.data.id,
    serverId: result.data.serverId,
  });

  if (member.status !== 200 || !member.data)
    return new NextResponse(
      JSON.stringify({ message: "Forbidden: Member details not found" }),
      { status: 403 }
    );

  if (member.data.role === "guest")
    return new NextResponse(
      JSON.stringify({ message: "Forbidden: Guest role" }),
      { status: 403 }
    );

  const operation = await deleteChannelOperation({
    channelId: result.data.channelId,
  });

  if (!operation.success) {
    return new NextResponse(JSON.stringify({ message: operation.message }), {
      status: 500,
    });
  }

  return new NextResponse(JSON.stringify({ message: operation.message }), {
    status: 200,
  });
}
