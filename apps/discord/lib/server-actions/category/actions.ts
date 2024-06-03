"use server";

import { revalidatePath } from "next/cache";
import { db } from "@db/db";
import { Category } from "@db/schema";

export const createCategory = async (
  name: string,
  serverId: string,
  memberId: string
) => {
  const category = await db
    .insert(Category)
    .values({ name, server_id: serverId,  })
    .returning();
  revalidatePath("/(main)/channel/[serverId]");
  return category;
};
