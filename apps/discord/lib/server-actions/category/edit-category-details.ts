"use server";

import { currentProfile } from "@/lib/auth/current-user";
import {
  editCategoryDetails,
  TEditCategoryData,
} from "@db/data-access/category/edit-category-details";
import { categoryDetailsSchema } from "@/lib/validations/category/edit-category-validation";
import { revalidatePath } from "next/cache";
import { getMemberDetails } from "@db/data-access/member/get-member-details";
export type TEditCategoryAction = TEditCategoryData & {
  serverId: string;
  memberId: string;
};

export const modifyCategoryDetailsAction = async (
  data: TEditCategoryAction
) => {
  const result = categoryDetailsSchema.safeParse(data);
  if (!result.success) {
    return {
      status: 400,
      success: false,
      error: result.error.message,
    };
  }

  const profile = await currentProfile();

  if (profile.status !== 200)
    return { status: profile.status, error: profile.message };

  if (!profile.data)
    return { status: 500, success: false, error: "Internal Server Error" };

  const memeber = await getMemberDetails({
    profileId: profile.data.id,
    serverId: data.serverId,
  });

  if (memeber.status !== 200 || !memeber.data)
    return { status: memeber.status, error: memeber.error };

  if (memeber.data.role === "guest") {
    return {
      status: 403,
      success: false,
      error: "You are not allowed to perform this action",
    };
  }

  const res = await editCategoryDetails({
    categoryId: data.categoryId,
    categoryName: data.categoryName,
  });

  if (res.status !== 200)
    return {
      status: res.status,
      success: false,
      error: res.error,
    };
  revalidatePath("/(protected)/[serverId]/[channelId]", "page");
  return {
    status: res.status,
    success: true,
    data: res.data,
  };
};
