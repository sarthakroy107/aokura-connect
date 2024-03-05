"use server";

import { currentProfile } from "@/lib/auth/current-user";
import { createCategorySchema } from "@/lib/validations/category/create-category-validation";
import {
  TCreateCategoryDB,
  createCategory,
} from "@db/data-access/category/create-category";
import { getMemberDetails } from "@db/data-access/member/get-member-details";
import { revalidatePath } from "next/cache";
export type TCreateCategoryAction = TCreateCategoryDB;
export const createCategoryAction = async (data: TCreateCategoryAction) => {
  const result = createCategorySchema.safeParse(data);
  if (!result.success) {
    return {
      status: 400,
      success: false,
      error: result.error.message,
    };
  }
  const profile = await currentProfile();
  if (profile.status !== 200 || !profile.data)
    return {
      status: 401,
      success: false,
      error: "Unauthorized",
    };

  const member = await getMemberDetails({
    profileId: profile.data.id,
    serverId: data.serverId,
  });

  if (member.status !== 200 || !member.data)
    return {
      status: 404,
      success: false,
      error: "Member not found",
    };

  if (member.data.role === "guest") {
    return {
      status: 403,
      success: false,
      error: "Unauthorized",
    };
  }

  const response = await createCategory(data);

  if (response.status !== 200) {
    return {
      status: response.status,
      success: false,
      error: response.error,
    };
  }

  revalidatePath("/(protected)/[serverId]/[channelId]", "page");

  return {
    status: 200,
    success: true,
    data: response.data,
  };
};
