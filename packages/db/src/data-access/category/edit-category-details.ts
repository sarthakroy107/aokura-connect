import { eq } from "drizzle-orm";
import { db } from "../../db.js";
import { Category } from "../../schema.js";

export type TEditCategoryData = {
  categoryId: string;
  categoryName: string;
};
export const editCategoryDetails = async ({
  categoryId,
  categoryName,
}: TEditCategoryData) => {
  try {
    await db
      .update(Category)
      .set({ name: categoryName, updated_at: new Date().toISOString() })
      .where(eq(Category.id, categoryId));

    return {
      status: 200 as const,
      success: true as const,
      data: "Category updated successfully" as const,
    };
  } catch (error) {
    console.error("Error in editCategoryDetails ", error);
    return {
      status: 500,
      success: false,
      error: "Internal Server Error",
    };
  }
};
