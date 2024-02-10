'use server';

import { revalidatePath } from "next/cache";
import { db } from "..";
import { Category } from "../schema";

export const createCategory = async (name: string, serverId: string, memberId: string) => {
    const category = await db.insert(Category).values({ name, server_id: serverId, creator_member_id: memberId }).returning();
    revalidatePath('/(main)/channel/[serverId]')
    return category;
}