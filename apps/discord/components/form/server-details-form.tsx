"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/lib/store/modal-store";
import useCurrentServer from "@/components/hooks/use-current-member";

import { updateServerDetails } from "@/lib/server-actions/server/actions";
import { serverFormSchema } from "@/lib/server-actions/server/validator";

import { Switch } from "@ui/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@ui/components/ui/form";
import { Button } from "@ui/components/ui/button";
import { Textarea } from "@ui/components/ui/textarea";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";
import { FileUpload } from "@/components/file-upload";
import NormalInput from "@/components/form/normal-input";
import { TServerDetailsDto } from "@db/dto/server/server-details-dto";


const ServerDetailsForm = ({
  data,
  newServer,
}: {
  data: TServerDetailsDto;
  newServer: boolean;
}) => {
  const { refetchServerData } = useCurrentServer();
  const { onClose } = useModal();
  const form = useForm<Omit<TDBServer, "created_at" | "updated_at" | "id">>({
    defaultValues: data,
    resolver: zodResolver(serverFormSchema),
  });

  const onSubmit = async (
    values: Omit<TDBServer, "created_at" | "updated_at" | "id">
  ) => {
    try {
      if (newServer) {} 
      else {
        if (!data.id) throw new Error("Refresh page and try again.");
        await updateServerDetails({ serverDetails: values, serverId: data.id });
        toast.success("Server details updated");
        if (refetchServerData) refetchServerData();
        form.reset();
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating server details");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem className="mb-3 w-full flex flex-col items-center">
              <FormLabel className="">SERVER AVATAR</FormLabel>
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
        <NormalInput
          {...form.register("name")}
          label="SERVER NAME"
          placeholder="Server name"
          containerClassName="mx-7"
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="my-1 mx-7">
              <FormLabel className="">DESCRIPTION</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Description"
                  className="bg-discord_darkest h-32 mt-1.5 rounded-[3px]"
                  value={field.value || ""}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_private"
          render={({ field }) => (
            <FormItem className="my-1 mx-7 flex space-x-2 items-center">
              <FormControl>
                <div className="flex items-center space-x-2 mt-1.5">
                  <Switch
                    id="airplane-mode"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className=" bg-discord_default text-discord_blurple data-[state=checked]:bg-discord_blurple"
                    color="#686bff"
                  />
                  <FormLabel htmlFor="airplane-mode">PRIVATE SERVER</FormLabel>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_joining_allowed"
          render={({ field }) => (
            <FormItem className="my-1 mx-7 flex space-x-2 items-center">
              <FormControl>
                <div className="flex items-center space-x-2 mt-1.5">
                  <Switch
                    id="airplane-mode"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className=" bg-discord_default text-discord_blurple data-[state=checked]:bg-discord_blurple"
                    color="#686bff"
                  />
                  <FormLabel htmlFor="airplane-mode">
                    NEW MEMBERS ALLOWED
                  </FormLabel>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <div className="w-full flex justify-end items-center h-16 bg-discord_darker rounded-b-md mt-3">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="mr-4 bg-discord_blurple hover:bg-discord_blurple text-white font-semibold rounded-[3px] w-20 h-9"
          >
            {
              form.formState.isSubmitting ? <BarLoader color="#fff" /> : "Save"
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ServerDetailsForm;
