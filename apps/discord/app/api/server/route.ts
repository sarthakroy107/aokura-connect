import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import {
  createServerOperation,
  type TCreateServerDBProps,
} from "@db/data-access/server/create-server";
import { z, ZodType } from "zod";

const newServerSchema: ZodType<TCreateServerDBProps> = z.object({
  serverName: z
    .string()
    .min(1, { message: "Server name is required" })
    .max(30, { message: "Server name must be less than 30 characters" }),
  creatorProfileId: z.string(),
  serverAvatar: z.string().url({ message: "Avatar must be a valid URL" }),
  serverDescription: z.string(),
});

export async function POST(req: NextRequest) {
  const body: TCreateServerDBProps = await req.json();
  try {
    const parsingResult = newServerSchema.safeParse(body);
    if (!parsingResult.success) {
      return new NextResponse(JSON.stringify({ error: parsingResult.error }), {
        status: 400,
      });
    }
    const dbRes = await createServerOperation(parsingResult.data);

    if (dbRes.status !== 200) {
      return new NextResponse(JSON.stringify({ error: dbRes.message }), {
        status: dbRes.status,
      });
    }
    revalidatePath("/(main)/channel/[serverId]", "layout");
    return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
  }
}

