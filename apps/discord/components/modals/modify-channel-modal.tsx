"use client";

import { useModal } from "@/lib/store/modal-store";
import { Dialog, DialogContent, DialogHeader } from "@ui/components/ui/dialog";
import { Separator } from "@ui/components/ui/separator";
import { useState } from "react";
import NormalInput from "../form/normal-input";
import { useForm } from "react-hook-form";
import ChannelTypeButton from "../channel/select-channel-type";
import { LucideHash, LucideVolume2 } from "lucide-react";
import SwitchInput from "../form/switch-imput";
import { Form, FormField } from "@ui/components/ui/form";
import { Button } from "@ui/components/ui/button";
import { cn } from "@/lib/utils";

const ModifyChannelModal = () => {
  const { isOpen, options, onClose } = useModal();
  const [viewing, setViewing] = useState<"details" | "delete" | "block">(
    "details"
  );
  const isModalOpen = isOpen && options.type === "modify-channel";

  if (!isModalOpen) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-discord rounded-[3px] p-0 h-80">
        <DialogHeader className="mt-7 text-xl rounded-[3px] font-medium">
          MODIFY CHANNEL
        </DialogHeader>
        <div className="flex px-3">
          <div className="text-sm flex flex-col gap-y-1">
            <button
              onClick={() => setViewing("details")}
              className={cn(
                "py-1 text-center hover:bg-slate-300/10 w-20 rounded-[3px]",
                viewing === "details" && "bg-slate-300/20 py-1 hover:bg-slate-300/20"
              )}
            >
              DETAILS
            </button>
            <button
              onClick={() => setViewing("block")}
              className={cn(
                "py-1 text-center hover:bg-slate-300/10 w-20 rounded-[3px]",
                viewing === "block" && "bg-slate-300/20 hover:bg-slate-300/20"
              )}
            >
              BLOCK
            </button>
            <button
              onClick={() => setViewing("delete")}
              className={cn(
                "py-1 text-center hover:bg-slate-300/10 w-20 rounded-[3px]",
                viewing === "delete" && "bg-slate-300/20 hover:bg-slate-300/20"
              )}
            >
              DELETE
            </button>
          </div>
          <Separator className="ml-1.5 mr-4 h-52" orientation="vertical" />
          {viewing === "details" ? (
            <ChangeChannelDetails
              channelId={options.data.channelId}
              channelName={options.data.channelName}
              channelType={options.data.channelType}
            />
          ) : viewing === "block" ? (
            <BlockChannel />
          ) : (
            <DeleteChannel />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModifyChannelModal;

type TModifyChannelForm = {
  channelName: string;
  private: boolean;
}

const ChangeChannelDetails = ({
  channelId,
  channelName,
  channelType,
}: {
  channelId: string;
  channelName: string;
  channelType: "text" | "voice" | "video";
}) => {
  const form = useForm<TModifyChannelForm>({
    defaultValues: {
      channelName,
      private: false,
    },
  });

  const onSubmit = async (value: TModifyChannelForm) => {
    console.table(value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-80 h-56">
        <FormField
          control={form.control}
          name="channelName"
          render={({ field }) => (
            <NormalInput
              label="CHANNEL NAME"
              placeholder="Channel name"
              {...field}
            />
          )}
        />
        <ChannelTypeButton
          label="Text Channel"
          selected={channelType === "text"}
          isLoading={false}
          hanedleClick={() => {}}
          disabled={true}
          LucideIconComponent={
            channelType === "text" ? LucideHash : LucideVolume2
          }
        />
        <FormField
          control={form.control}
          name="private"
          render={({ field }) => (
            <SwitchInput
              label="PRIVATE CHANNEL"
              value={field.value}
              onChange={field.onChange}
              className="mt-3"
            />
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" className="mt-2 w-14 h-7 text-sm">
            SAVE
          </Button>
        </div>
      </form>
    </Form>
  );
};

function BlockChannel() {
  return (
    <div className="flex flex-col gap-y-2 items-center h-56">
      <p>Are you sure you want to block this channel?</p>
      <Button className="mt-2 w-20 h-7 text-sm">BLOCK</Button>
    </div>
  );
}

function DeleteChannel() {
  return (
    <div className="flex flex-col gap-y-2 items-center h-56">
      <p>Are you sure you want to delete this channel?</p>
      <Button className="mt-2 w-20 h-7 text-sm bg-red-600 hover:bg-red-600/80">
        DELETE
      </Button>
    </div>
  );
}
