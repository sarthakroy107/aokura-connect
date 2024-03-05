"use client";

import { useModal } from "@/lib/store/modal-store";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@ui/components/ui/alert-dialog";
import { Button } from "@ui/components/ui/button";
import { categoryDetailsSchema } from "@/lib/validations/category/edit-category-validation";
import { z } from "zod";
import useCurrentServer from "../hooks/use-current-member";
import { toast } from "sonner";
import { useState } from "react";
import { deleteCategoryAction } from "@/lib/server-actions/category/delete-category";
import { deleteCategorySchema } from "@/lib/validations/category/delete-category-validation";
import { BarLoader } from "react-spinners";

const DeleteCategoryModal = () => {
  const { isOpen, options, onClose } = useModal();
  const { member, server } = useCurrentServer();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isModalOpen = isOpen && options.type === "delete-category";

  const handleDelete = async () => {
    setIsSubmitting(true);
    const parsingObject: z.infer<typeof deleteCategorySchema> = {
      categoryId: options.data?.categoryId!,
      serverId: server?.id!,
      memberId: member?.id!,
    };
    const result = deleteCategorySchema.safeParse(parsingObject);
    if (!result.success) {
      setIsSubmitting(false);
      toast.error(result.error.message);
      return;
    }
    const res = await deleteCategoryAction(parsingObject);
    setIsSubmitting(false);
    if (res.status !== 200) {
      toast.error(res.error);
      return;
    }
    toast.success(res.data);
    onClose();
  };

  return (
    <AlertDialog open={isModalOpen}>
      <AlertDialogContent className="p-0 bg-discord sm:rounded-[3px]">
        <AlertDialogHeader className="text-2xl font-medium uppercase mt-5">
          Delete Category
        </AlertDialogHeader>
        <AlertDialogDescription className="text-center mb-7 px-3">
          All the channels and messages related to{" "}
          <strong className="font-semibold text-white uppercase">
            {options.data?.categoryName}
          </strong>{" "}
          will be deleted
        </AlertDialogDescription>
        <AlertDialogFooter className="p-3.5 px-5 bg-discord_darker">
          <AlertDialogCancel
            onClick={() => onClose()}
            className="bg-transparent hover:bg-transparent hover:underline mt-0 border-0 text-white"
          >
            Cancel
          </AlertDialogCancel>
          <Button
            type="button"
            onClick={handleDelete}
            className="bg-rose-600 hover:bg-rose-500 text-white uppercase w-24"
          >
            {isSubmitting ? <BarLoader color="#fff" /> : "DELETE"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCategoryModal;
