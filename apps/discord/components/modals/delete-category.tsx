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
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { deleteCategorySchema } from "@/lib/validations/category/delete-category-validation";
import { BarLoader } from "react-spinners";
import { useParams } from "next/navigation";
import { TAPIDeleteCategoryResponse } from "@/app/api/server-category/route";
import useCurrentServer from "../hooks/use-current-member";

const DeleteCategoryModal = () => {
  const { isOpen, options, onClose } = useModal();
  const { serverId } = useParams<{ serverId: string }>();

  const { member, server } = useCurrentServer(serverId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isModalOpen = isOpen && options.type === "delete-category";
  if (options.type !== "delete-category") return null;

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

    const res = await fetch(
      `/api/server-category?category_id=${options.data?.categoryId}&server_id=${server?.id}&member_id=${member?.id}`,
      {
        method: "DELETE",
        cache: "no-cache",
      }
    );

    const resData: TAPIDeleteCategoryResponse = await res.json();

    setIsSubmitting(false);
    if (res.status !== 200) {
      toast.error(resData.message);
      return;
    }
    toast.success(resData.message);
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
