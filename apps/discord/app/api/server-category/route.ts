import {
  createCategoryAction,
  TCreateCategoryAction,
} from "@/lib/server-actions/category/create-category";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body: TCreateCategoryAction = await req.json();
  const res = await createCategoryAction(body);

  if (res.status !== 200 || res.error || !res.data) {
    return new NextResponse(null, { status: res.status });
  }

  return new NextResponse(JSON.stringify(res.data), { status: 405 });
}
