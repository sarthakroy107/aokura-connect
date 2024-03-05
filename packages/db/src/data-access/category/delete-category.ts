import { eq } from "drizzle-orm";
import { db } from "../../db.js";
import { Category } from "../../schema.js";

export type TDeleteCategoryDB = {
  categoryId: string;
};

export const deleteCategory = async ({categoryId}: TDeleteCategoryDB) => {
  try {
    await db.delete(Category).where(eq(Category.id, categoryId));
    return {
      status: 200,
      success: true,
      data: "Category deleted successfully"
    }
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      success: false,
      error: "Internal server error",
    }
  }
}