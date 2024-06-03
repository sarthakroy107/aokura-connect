import { db } from "../../db.js";
import { Category } from "../../schema.js";

export type TCreateCategoryDB = {
  serverId: string;
  categoryName: string;
  creatorMemberId: string;
};
export const createCategory = async ({
  categoryName,
  creatorMemberId,
  serverId,
}: TCreateCategoryDB) => {

  try {
    await db.insert(Category).values({
      server_id: serverId,
      name: categoryName,
    });

    return {
      status: 200 as const,
      success: true as const,
      data: "Category created successfully",
    };

  } catch (error) {
    console.log(error);
    return {
      status: 500,
      success: false,
      error: "Internal Server Error",
    };
  }
};
