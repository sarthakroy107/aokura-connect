"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from "@ui/components/ui/dialog";
import { useModal, TEditCategoryData } from "@/lib/store/modal-store";
import { useForm } from "react-hook-form";
import NormalInput from "../form/normal-input";
import { Button } from "@ui/components/ui/button";
import { toast } from "sonner";
import useCurrentServer from "../hooks/use-current-member";
import { modifyCategoryDetailsAction } from "@/lib/server-actions/category/edit-category-details";
import { categoryDetailsSchema } from "@/lib/validations/category/edit-category-validation";
import { z } from "zod";
import { BarLoader } from "react-spinners";

const ModifyCategoryModal = () => {
  const { isOpen, onClose, options } = useModal();
  const isDialogOpen = isOpen && options.type === "modify-category";
  const { member, server } = useCurrentServer();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<TEditCategoryData>({
    defaultValues: {
      categoryId: options.data?.categoryId,
      categoryName: options.data?.categoryName,
    },
  });

  const onSubmit = async (data: TEditCategoryData) => {
    const parsingObject: z.infer<typeof categoryDetailsSchema> = {
      categoryId: options.data?.categoryId!,
      categoryName: data.categoryName,
      serverId: server?.id!,
      memberId: member?.id!,
    };

    const result = categoryDetailsSchema.safeParse(parsingObject);
    if (!result.success) {
      toast.error(result.error.message);
      return;
    }
    const res = await modifyCategoryDetailsAction(result.data);

    if (res.status !== 200) {
      toast.error(res.error);
      return;
    }

    toast.success("Category updated successfully");
    reset({});
    onClose();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={() => onClose()}>
      <DialogContent className="bg-discord sm:rounded-[3px] p-0">
        <DialogHeader className="text-2xl font-medium text-white mt-5">
          Edit Category
        </DialogHeader>
        <form className="" onSubmit={handleSubmit(onSubmit)}>
          <NormalInput
            disabled={isSubmitting}
            containerClassName="px-7"
            label="CATEGORY NAME"
            defaultValue={options.data?.categoryName}
            {...register("categoryName", {
              required: { value: true, message: "Category is required" },
            })}
            placeholder="CATEGORY NAME"
          />
          <DialogFooter className="bg-discord_darker p-3.5 px-5">
            <Button type="submit" disabled={isSubmitting} className="w-20">
              {isSubmitting ? <BarLoader color="#ffffff" /> : "SUBMIT"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModifyCategoryModal;
