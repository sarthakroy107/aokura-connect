"use client";

import { ModalEnum, useModal } from "@/lib/store/modal-store";
import { FileUpload } from "@/components/file-upload";
import { createServer } from "@/lib/server-actions/server/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { currentProfile } from "@/lib/auth/current-user";
import { useUser } from "@clerk/nextjs";
import { useCurrentProfile } from "../hooks/use-current-profile";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Server name is required" })
    .max(30, { message: "Server name must be less than 30 characters" }),
  avatar: z.string().url({ message: "Avatar must be a valid URL" }),
  profile_id: z.string(),
});

const CreateServerModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === ModalEnum.CREATE_SERVER;
  const router = useRouter();
  const { user } = useUser();
  const { currentProfileData } = useCurrentProfile();
  console.log({ user });
  const form = useForm<z.infer<typeof formSchema>>();
  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (data.profile?.id) {
        if (currentProfileData?.id === data.profile.id)
          values.profile_id = data.profile.id;
        else {
          const profile = await currentProfile();
          if (!profile) throw new Error("Profile not found from create-server-modal ");
          values.profile_id = profile?.id;
        }
      }
      console.log(values);
      formSchema.parse(values);

      await createServer(values.name, values.avatar, values.profile_id);
      form.reset();
      onClose();
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      <DialogContent className="bg-discord p-0 rounded-[3px]">
        <DialogHeader className="mt-8 w-full flex flex-col items-center">
          <DialogTitle className="text-2xl font-semibold">
            Create your own Server
          </DialogTitle>
          <DialogDescription className="px-12 mt-3 text-center">
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem className="mx-5 flex justify-center">
                  <FormControl>
                    <FileUpload
                      onChange={field.onChange}
                      value={field.value}
                      endpoint="serverImage"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem className="mx-5 mb-3 rounded-[3px]">
                  <FormLabel className="uppercase font-medium text-white text-opacity-20">
                    Server Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-[#202225] rounded-[3px] outline-none focus-visible:ring-offset-0 focus-visible:ring-0"
                      {...field}
                      placeholder="Server Name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="bg-[#282b30] px-6 py-4">
              <Button
                type="submit"
                className="bg-discord_default rounded-[2px] text-white hover:bg-discord_default"
                disabled={isSubmitting}
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateServerModal;
