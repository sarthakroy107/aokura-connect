"use client";

import * as z from "zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ModalEnum, useModal } from "@/lib/store/modal-store";
import { createChannel } from "@/lib/server-actions/channel/actions";
import { useCurrentProfile } from "@/components/hooks/use-current-profile";
import useCurrentServer from "@/components/hooks/use-current-member";
import { LucideIcon, LucideVolume2 } from "lucide-react";

import { channelTypesEnum } from "@db/schema";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@ui/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@ui/components/ui/form";
import { Input } from "@ui/components/ui/input";
import { Button } from "@ui/components/ui/button";
import { toast } from "sonner";
import { LucideHash } from "lucide-react";
import { cn } from "@ui/lib/utils";
import { Label } from "@ui/components/ui/label";
import { BarLoader } from "react-spinners";
import ChannelTypeButton from "../channel/select-channel-type";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is rquired" })
    .max(16, { message: "Name must be less than 16 characters" }),
  type: z.nativeEnum(channelTypesEnum),
  member_id: z.string(),
});

const CreateChannelModal = () => {
  const router = useRouter();
  const { serverId } = useParams<{ serverId: string }>();
  const { isOpen, type, onClose, data } = useModal();

  const { profile: currentProfileData } = useCurrentProfile();
  const { member } = useCurrentServer(serverId);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      type: channelTypesEnum.TEXT,
    },
  });

  const isModalOpen = isOpen && type === ModalEnum.CREATE_CHANNEL;
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      values.member_id = member?.id as string;

      console.log({ currentProfileData, member });
      console.log(values);
      formSchema.parse(values);
      await createChannel({
        name: values.name,
        type: values.type,
        serverId,
        categoryId: data.category?.id as string,
        memberId: values.member_id,
      });

      toast.success("Channel created");
      form.reset();
      onClose();
      router.refresh();
    } catch (error) {
      toast.error("Channel creation failed");
      console.log(error);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      <DialogContent className="bg-discord rounded-[2px] p-0">
        <DialogHeader className="text-2xl font-semibold mt-8 mb-0 pb-0 text-center uppercase">
          Create Channel
        </DialogHeader>
        <DialogDescription className="text-center uppercase mt-0 pt-0">
          in {data.category?.name} category
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="name"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem className="mb-5 px-6">
                  <FormLabel className="uppercase">Channel Name</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-discord_darkest focus-visible:ring-0 focus-visible:ring-offset-0 rounded-[3px]"
                      {...field}
                      placeholder="Channel name"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Label className="uppercase mx-6">Type</Label>
            <div className="mx-6 mt-2 space-y-4">
              <ChannelTypeButton
                hanedleClick={() =>
                  form.setValue("type", channelTypesEnum.TEXT)
                }
                label="Text"
                selected={form.watch("type") === channelTypesEnum.TEXT}
                LucideIconComponent={LucideHash}
                isLoading={isLoading}
                disabled={false}
              />
              <ChannelTypeButton
                hanedleClick={() =>
                  form.setValue("type", channelTypesEnum.VOICE)
                }
                label="Voice"
                selected={form.watch("type") === channelTypesEnum.VOICE}
                LucideIconComponent={LucideVolume2}
                isLoading={isLoading}
                disabled={false}
              />
            </div>
            <DialogFooter className="bg-discord_darker mt-4 p-4">
              <Button type="submit" className="w-20">
                {
                  isLoading ? <BarLoader color="#fff" /> : "CREATE"
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;
