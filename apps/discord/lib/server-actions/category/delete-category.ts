"use server";

import { currentProfile } from "@/lib/auth/current-user";
import {
  TDeleteCategoryDB,
  deleteCategory,
} from "@db/data-access/category/delete-category";
import { getMemberDetails } from "@db/data-access/member/get-member-details";
import { stat } from "fs";
import { revalidatePath } from "next/cache";

export type TDeleteCategoryAction = TDeleteCategoryDB & {
  memberId: string;
  serverId: string;
};

export const deleteCategoryAction = async (data: TDeleteCategoryAction) => {
  try {
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

    if (member.status !== 200 || !member.data || member.data.role === "guest") {
      return {
        status: 403,
        success: false,
        error: "Forbidden",
      };
    }

    const res = await deleteCategory({ categoryId: data.categoryId });

    if (res.status !== 200)
      return {
        status: res.status,
        success: false,
        error: res.error,
      };
      revalidatePath("/(protected)/[serverId]/[channelId]", "page");
    return {
      status: 200,
      success: true,
      data: "Category deleted successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      success: false,
      error: "Internal server error",
    };
  }
};
