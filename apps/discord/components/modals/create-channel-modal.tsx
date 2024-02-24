"use client";

import { createChannel } from "@/lib/server-actions/channel/actions";

import * as z from "zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { channelTypesEnum } from "@db/schema";
import { ModalEnum, useModal } from "@/lib/store/modal-store";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import useCurrentServer from "../hooks/use-current-member";

const CreateChannelModal = () => {
  const router = useRouter();
  const params = useParams<{ serverId: string }>();

  const formSchema = z.object({
    name: z
      .string()
      .min(1, { message: "Name is rquired" })
      .max(16, { message: "Name must be less than 16 characters" }),
    type: z.nativeEnum(channelTypesEnum),
    member_id: z.string(),
  });

  const { isOpen, type, onClose, data } = useModal();

  const { currentProfileData, member } = useCurrentServer();
  console.log({ currentProfileData, member });

  //const { user } = useUser();

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
      await createChannel(
        values.name,
        values.type,
        params!.serverId,
        data.category?.id as string,
        values.member_id
      );

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
        <DialogHeader className="text-2xl font-semibold mt-8 mb-0 pb-0 text-center pl-40">
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
            <FormField
              name="type"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem className="px-5 flex flex-col">
                  <FormLabel className="uppercase">Channel Type</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="bg-discord_darkest">
                      <SelectTrigger className="border-discord_darker text-white focus:ring-0 ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                        <SelectValue
                          className="bg-discord_darkest"
                          placeholder="Select a channel type"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="mb-5 bg-discord_darker">
                      {Object.values(channelTypesEnum).map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="capitalize"
                        >
                          {type.toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="bg-discord_darker mt-4">
              <Button
                type="submit"
                className="bg-discord_purple text-white m-3 hover:bg-discord_purple"
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

export default CreateChannelModal;
