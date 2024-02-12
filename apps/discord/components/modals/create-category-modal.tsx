"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Input } from "@ui/components/ui/input";
import { ModalEnum, useModal } from "@/lib/store/modal-store";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";

import { Button } from "../ui/button";
import { createCategory } from "@/lib/server-actions/category/actions";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CreateCategoryModal = () => {

  const { isOpen, onClose, type } = useModal();

  const params = useParams<{ serverId: string }>();

  const form = useForm<{ name: string }>();

  const isModalOpen = isOpen && type === ModalEnum.CREATE_CATEGORY;

  const isLoading = form.formState.isSubmitting;

  const router = useRouter();

  const onSubmit = async (data: { name: string }) => {
    try {
      await createCategory(
        data.name,
        params!.serverId,
        "0fea1fb7-38ef-44f2-afd3-bc3dda4ce7ea"
      );
      toast.success("Category created successfully");
      form.reset();
      onClose();
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      {/* @ts-ignore */}
      <DialogContent className="bg-discord text-white p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          {/* @ts-ignore */}
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
                    {/* @ts-ignore */}
                    <FormLabel className="uppercase text-xs font-bold">
                      Category name
                    </FormLabel>
                    {/* @ts-ignore */}
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-[#202225] border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter category name"
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
                className="bg-discord_purple hover:bg-discord_purple text-white"
                disabled={isLoading}
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryModal;
