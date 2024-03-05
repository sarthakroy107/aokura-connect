"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui/components/ui/dialog";
import { useForm } from "react-hook-form";
import { ModalEnum, useModal } from "@/lib/store/modal-store";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";

import { Button } from "@ui/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BarLoader } from "react-spinners";
import useCurrentServer from "../hooks/use-current-member";
import NormalInput from "@/components/form/normal-input";
import { createCategorySchema } from "@/lib/validations/category/create-category-validation";
import { ZodType, z } from "zod";
import { createCategoryAction } from "@/lib/server-actions/category/create-category";

const CreateCategoryModal = () => {
  const { isOpen, onClose, type } = useModal();
  const { server, member } = useCurrentServer();
  const form = useForm<{ name: string }>();

  const isModalOpen = isOpen && type === ModalEnum.CREATE_CATEGORY;
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: { name: string }) => {
    try {
      const parsingObject: z.infer<typeof createCategorySchema> = {
        serverId: server!.id,
        categoryName: data.name,
        creatorMemberId: member!.id,
      };

      const result = createCategorySchema.safeParse(parsingObject);

      if (!result.success) {
        toast.error(result.error.message);
        return;
      }

      const res = await createCategoryAction(result.data);

      if (res.status !== 200) {
        toast.error(res.error);
        return;
      }

      toast.success("Category created successfully");
      form.reset();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      <DialogContent className="bg-discord text-white p-0 overflow-hidden sm:rounded-[3px]">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold">
            Create Category
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <NormalInput
                        label="CATEGORY NAME"
                        disabled={isLoading}
                        placeholder="ENTER CATEGORY NAME"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-[#282b30] px-6 py-4">
              <Button
                type="submit"
                className="text-white uppercase w-20"
                disabled={isLoading}
              >
                {isLoading ? <BarLoader color="#fff" /> : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryModal;
