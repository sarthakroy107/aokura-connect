import { ZodType, z } from "zod";
import { TEditCategoryAction } from "@/lib/server-actions/category/edit-category-details";

export const categoryDetailsSchema: ZodType<TEditCategoryAction> = z.object({
  categoryId: z.string().min(1, { message: "Category id is required" }),
  categoryName: z.string().min(1, { message: "Category name is required" }),
  serverId: z.string().min(1, { message: "Server id is required" }),
  memberId: z.string().min(1, { message: "Member id is required" }),
});
