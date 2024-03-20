"use client";

import { useModal } from "@/lib/store/modal-store";
import { Dialog, DialogContent, DialogHeader } from "@ui/components/ui/dialog";
import { Separator } from "@ui/components/ui/separator";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LucideHash, LucideVolume2 } from "lucide-react";
import { Form, FormField } from "@ui/components/ui/form";
import { Button } from "@ui/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { EditChannelAction } from "@/lib/server-actions/channel/edit-channel";
import { useRouter } from "next/navigation";
import { BarLoader } from "react-spinners";
import NormalInput from "../form/normal-input";
import ChannelTypeButton from "../channel/select-channel-type";
import deleteChannelAction from "@/lib/server-actions/channel/delete-channel";
import SwitchInput from "../form/switch-imput";
import { useSocket } from "../provider/socket-provider";
import useCurrentServer from "../hooks/use-current-member";

const ModifyChannelModal = () => {
  const { isOpen, options, onClose } = useModal();
  const [viewing, setViewing] = useState<"details" | "delete" | "block">(
    "details"
  );

  const router = useRouter();
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
                viewing === "details" &&
                  "bg-slate-300/20 py-1 hover:bg-slate-300/20"
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
              {...options.data}
              successHandler={() => {
                router.refresh();
                onClose();
              }}
            />
          ) : viewing === "block" ? (
            <ChangeChannelStatus
              channelId={options.data.channelId}
              currentState={options.data.isBlocked}
              serverId={options.data.serverId}
            />
          ) : (
            <DeleteChannel
              {...options.data}
              successHandler={() => {
                router.refresh();
                onClose();
              }}
            />
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
};

const ChangeChannelDetails = ({
  serverId,
  channelId,
  channelName,
  channelType,
  isPrivate,
  successHandler,
}: {
  serverId: string;
  channelId: string;
  channelName: string;
  channelType: "text" | "voice" | "video";
  isPrivate: boolean;
  successHandler: () => void;
}) => {
  const form = useForm<TModifyChannelForm>({
    defaultValues: {
      channelName,
      private: false,
    },
  });

  const onSubmit = async (value: TModifyChannelForm) => {
    if (!value.channelName) {
      toast.error("Channel name is required");
      return;
    }

    if (value.channelName === channelName && value.private === isPrivate) {
      toast.success("No changes detected");
      return;
    }

    const res = await EditChannelAction({
      channelId,
      channelName: value.channelName,
      isBlocked: false,
      isPrivate: value.private,
      serverId,
    });

    if (res.status !== 200) {
      toast.error(res.message);
      return;
    }

    toast.success("Channel updated successfully");
    successHandler();
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
              disabled={form.formState.isSubmitting}
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
          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            className="mt-2 w-14 h-7 text-sm"
          >
            {form.formState.isSubmitting ? (
              <BarLoader color="#fff" width={25} />
            ) : (
              "SAVE"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

function ChangeChannelStatus({
  channelId,
  currentState,
  serverId,
}: {
  channelId: string;
  currentState: boolean;
  serverId: string;
}) {
  const { socket: io } = useSocket();
  const { member } = useCurrentServer(serverId);
  const [isBlocked, setIsBlocked] = useState(currentState);

  const handleChangeStatus = () => {
    //console.table(member);
    if (!member) {
      toast.error("You are not a member of this server");
      return;
    }
    if (member.role === "guest") {
      toast.error("You are not allowed to perform this action");
      return;
    }
    if (!io) {
      toast.error("Socket not connected");
      return;
    }
    const obj = {
      channelId,
      newState: !isBlocked,
    };
    io.emit("event:change-channel-status", obj);
    setIsBlocked((prev) => !prev);
    console.log("emitted");
  };

  return (
    <div className="flex flex-col gap-y-2 items-center h-56">
      <p>Are you sure you want to block this channel?</p>
      <Button
        type="button"
        onClick={handleChangeStatus}
        className="mt-2 w-20 h-7 text-sm"

      >
        {isBlocked ? "UNBLOCK" : "BLOCK"}
      </Button>
    </div>
  );
}

function DeleteChannel({
  channelId,
  serverId,
  successHandler,
}: {
  channelId: string;
  serverId: string;
  successHandler: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    setIsSubmitting(true);
    const res = await deleteChannelAction({
      channelId,
      serverId,
    });

    setIsSubmitting(false);

    if (res.status !== 200) {
      toast.error(res.message);
      return;
    }
    toast.success("Channel deleted successfully");
    successHandler();
  };

  return (
    <div className="flex flex-col gap-y-2 items-center h-56">
      <p>Are you sure you want to delete this channel?</p>
      <Button
        disabled={isSubmitting}
        onClick={handleDelete}
        className="mt-2 w-20 h-7 text-sm bg-red-600 hover:bg-red-600/80"
      >
        {isSubmitting ? <BarLoader color="#fff" width={25} /> : "DELETE"}
      </Button>
    </div>
  );
}
