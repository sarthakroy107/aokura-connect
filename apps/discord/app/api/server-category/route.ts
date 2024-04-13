import { currentProfile } from "@/lib/auth/current-user";
import {
  createCategoryAction,
  TCreateCategoryAction,
} from "@/lib/server-actions/category/create-category";
import { deleteCategory } from "@db/data-access/category/delete-category";
import { getMemberDetails } from "@db/data-access/member/get-member-details";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { deleteCategorySchema } from "@/lib/validations/category/delete-category-validation";
import { categoryDetailsSchema } from "@/lib/validations/category/edit-category-validation";
import { z } from "zod";
import { editCategoryDetails } from "@db/data-access/category/edit-category-details";

//*---------------------------------------------POST--------------------------------------------

export async function POST(req: NextRequest) {
  const body: TCreateCategoryAction = await req.json();
  const res = await createCategoryAction(body);

  if (res.status !== 200 || res.error || !res.data) {
    return new NextResponse(null, { status: res.status });
  }
  return new NextResponse(JSON.stringify(res.data), { status: 405 });
}

//*---------------------------------------------PUT---------------------------------------------

export async function PUT(req: NextRequest) {
  const body: z.infer<typeof categoryDetailsSchema> = await req.json();
  const result = categoryDetailsSchema.safeParse(body);

  if (!result.success) {
    return new NextResponse(
      JSON.stringify({
        message: `Invalid request: ${result.error.errors.map((e) => `${e.path}: ${e.message}`).join(" | ")}`,
      }),
      { status: 400 }
    );
  }

  const profile = await currentProfile();

  if (profile.status !== 200 || !profile.data)
    return new NextResponse(
      JSON.stringify({
        message: "Unauthorized: User not logged in",
      }),
      { status: 401 }
    );

  const memeber = await getMemberDetails({
    profileId: profile.data.id,
    serverId: result.data.serverId,
  });

  if (memeber.status !== 200 || !memeber.data)
    return new NextResponse(
      JSON.stringify({
        message: "Unauthorized: Member not found",
      }),
      { status: 500 }
    );

  if (memeber.data.role === "guest") {
    return new NextResponse(
      JSON.stringify({
        message: "Forbidden: Guest user",
      }),
      { status: 403 }
    );
  } else if (memeber.data.isBanned) {
    return new NextResponse(
      JSON.stringify({
        message: "Forbidden: User is banned",
      }),
      { status: 403 }
    );
  } else if (memeber.data.isKicked) {
    return new NextResponse(
      JSON.stringify({
        message: "Forbidden: User is kicked",
      }),
      { status: 403 }
    );
  }

  const dbRes = await editCategoryDetails({
    categoryId: result.data.categoryId,
    categoryName: result.data.categoryName,
  });

  if (dbRes.status !== 200)
    return new NextResponse(
      JSON.stringify({
        message: "Internal server error",
      }),
      { status: 500 }
    );
  revalidatePath("/(protected)/[serverId]/[channelId]", "page");
  return new NextResponse(
    JSON.stringify({ message: "Category updated successfully" }),
    { status: 200 }
  );
}

//*-------------------------------------------DELETE--------------------------------------------

export type TAPIDeleteCategoryResponse = { message: string };

export async function DELETE(req: NextRequest) {
  const categoryId = req.nextUrl.searchParams.get("category_id");
  const serverId = req.nextUrl.searchParams.get("server_id");
  const memberId = req.nextUrl.searchParams.get("member_id");

  const parseResult = deleteCategorySchema.safeParse({
    categoryId,
    serverId,
    memberId,
  });

  if (!parseResult.success) {
    return new NextResponse(
      JSON.stringify({
        message: `Invalid request: ${parseResult.error.errors.map((e) => `${e.path}: ${e.message}`).join(" | ")}`,
      } satisfies TAPIDeleteCategoryResponse),
      { status: 400 }
    );
  }

  try {
    const profile = await currentProfile();

    if (profile.status !== 200 || !profile.data)
      return new NextResponse(
        JSON.stringify({
          message: "Unauthorized",
        } satisfies TAPIDeleteCategoryResponse),
        {
          status: 401,
        }
      );

    const member = await getMemberDetails({
      profileId: profile.data.id,
      serverId: parseResult.data.serverId,
    });

    if (member.status !== 200 || !member.data || member.data.role === "guest") {
      return new NextResponse(
        JSON.stringify({
          message: "Forbidden",
        } satisfies TAPIDeleteCategoryResponse),
        {
          status: 403,
        }
      );
    }

    const res = await deleteCategory({
      categoryId: parseResult.data.categoryId,
    });

    if (res.status !== 200)
      return new NextResponse(
        JSON.stringify({
          message: res.error || "Category deletion failed",
        } satisfies TAPIDeleteCategoryResponse),
        {
          status: res.status,
        }
      );
    revalidatePath("/(protected)/[serverId]/[channelId]", "page");
    return new NextResponse(
      JSON.stringify({
        message: "Category deleted successfully",
      } satisfies TAPIDeleteCategoryResponse),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}
