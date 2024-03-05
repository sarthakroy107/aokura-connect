import { TCreateCategoryAction } from "@/lib/server-actions/category/create-category";
import { ZodType, z } from "zod";

export const createCategorySchema: ZodType<TCreateCategoryAction> = z.object({
  serverId: z.string().min(1, { message: "Server ID is required" }),
  categoryName: z.string().min(1, { message: "Category name is required" }),
  creatorMemberId: z
    .string()
    .min(1, { message: "Creator member ID is required" }),
});
