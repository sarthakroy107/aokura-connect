import { TDeleteCategoryData } from "@/lib/store/modal-store";
import { ZodType, z } from "zod";
import { TDeleteCategoryAction } from "@/lib/server-actions/category/delete-category"

export const deleteCategorySchema: ZodType<TDeleteCategoryAction> = z.object({
    categoryId: z.string().min(1, { message: "Category id is required" }),
    serverId: z.string().min(1, { message: "Server id is required" }),
    memberId: z.string().min(1, { message: "Member id is required" }),
})