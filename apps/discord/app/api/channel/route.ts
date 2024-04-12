import { NextRequest, NextResponse } from "next/server";
import {
  createChannelOperation,
  type TCreateChannelDBProps,
} from "@db/data-access/channel/create-channel";
import { z, ZodType } from "zod";

export type TAPICreateChannelReturn =
  | {
      channelId: string;
    }
  | { error: string };

export const createChannelSchema: ZodType<TCreateChannelDBProps> = z.object({
  name: z
    .string()
    .min(1, { message: "Name is rquired" })
    .max(32, { message: "Name must be less than 16 characters" }),
  type: z.enum(["text", "voice"]),
  memberId: z.string(),
  serverId: z.string(),
  categoryId: z.string(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = createChannelSchema.safeParse(body);
  if (result.success === false) {
    return new NextResponse(
      JSON.stringify({
        error: result.error.message,
      } satisfies TAPICreateChannelReturn),
      { status: 500 }
    );
  }

  try {
    const dbRes = await createChannelOperation(result.data);
    return new NextResponse(
      JSON.stringify({ channelId: dbRes } satisfies TAPICreateChannelReturn),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error as string }, { status: 500 });
  }

}
