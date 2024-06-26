"use client";

import { ModalEnum, useModal } from "@/lib/store/modal-store";
import { FileUpload } from "@/components/file-upload";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { Input } from "@ui/components/ui/input";
import { Button } from "@ui/components/ui/button";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { currentProfile } from "@/lib/auth/current-user";
import { useCurrentProfile } from "../hooks/use-current-profile";
import type { TCreateServerDBProps } from "@db/data-access/server/create-server";
import { toast } from "sonner";

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

  const { profile: currentProfileData } = useCurrentProfile();

  const form = useForm<z.infer<typeof formSchema>>();

  const isSubmitting = form.formState.isSubmitting;

  if (!currentProfileData) {
    return (
      <Dialog open={false}>
        <DialogContent>Profile not found</DialogContent>
      </Dialog>
    );
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (data.profile?.id) {
        if (currentProfileData?.id === data.profile.id)
          values.profile_id = data.profile.id;
        else {
          const profile = await currentProfile();
          if (!profile)
            throw new Error("Profile not found from create-server-modal ");
          values.profile_id = currentProfileData?.id;
        }
      }

      formSchema.parse(values);

      const res = await fetch("/api/server", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creatorProfileId: values.profile_id,
          serverName: values.name,
          serverAvatar: values.avatar,
          serverDescription: "",
        } satisfies TCreateServerDBProps),
      });
      if (res.status !== 200) {
        toast.error("Server not created");
        console.error(await res.json());
      }
      form.reset();
      onClose();
      router.refresh();
      toast.success("Server created successfully");
    } catch (error) {
      console.log(error);
      toast.error("Server not created");
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
                <FormItem className="mx-5 m-3 rounded-[3px]">
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
                // className="bg-discord_default rounded-[2px] text-white hover:bg-discord_default"
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
