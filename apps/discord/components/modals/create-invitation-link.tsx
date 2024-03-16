"use client";

import { useParams } from "next/navigation";
import { BarLoader, PuffLoader } from "react-spinners";
import { useForm } from "react-hook-form";
import { useModal } from "@/lib/store/modal-store";
import useCurrentServer from "@/components/hooks/use-current-member";

import { Dialog, DialogContent, DialogHeader } from "@ui/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { Label } from "@ui/components/ui/label";
import { Button } from "@ui/components/ui/button";
import { cn } from "@ui/lib/utils";
import {
  type TInvitationLinkMaxUsersKeys,
  type TInvitationLinkValidityKeys,
  type TNewInvitationLink,
  newInvitationLinkSchema,
} from "@/lib/validations/invitation-link/new-invitation-link";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInvitationLinkAction } from "@/lib/server-actions/invitation-link/create-invitaion-link";
import { toast } from "sonner";
import { useState } from "react";
import copy from "clipboard-copy";

const maxUsersCountArray: {
  key: TInvitationLinkMaxUsersKeys;
  value: string;
}[] = [
  { key: "1", value: "1" },
  { key: "5", value: "5" },
  { key: "10", value: "10" },
  { key: "25", value: "25" },
  { key: "50", value: "50" },
  { key: "100", value: "100" },
  { key: "no-limit", value: "No limit" },
];

const validLinkDatesKeys: {
  key: TInvitationLinkValidityKeys;
  value: string;
}[] = [
  { key: "30-mins", value: "30 mins" },
  { key: "1-hours", value: "1 hour" },
  { key: "6-hours", value: "6 hours" },
  { key: "12-hours", value: "12 hours" },
  { key: "1-days", value: "1 day" },
  { key: "7-days", value: "7 days" },
  { key: "30-days", value: "30 days" },
  { key: "never", value: "Never" },
];

const CreateInvitaionLinkModal = () => {
  const { serverId } = useParams<{ serverId: string }>();
  const { isOpen, options, onClose } = useModal();
  const { member, isServerDataFetching } = useCurrentServer(serverId);
  const [link, setLink] = useState<string | null>(null);

  const {
    setValue,
    watch,
    handleSubmit,
    setError,
    formState: { isLoading, errors },
  } = useForm<TNewInvitationLink>({
    defaultValues: {
      validity: "7-days",
      maxUsers: "no-limit",
    },
    resolver: zodResolver(newInvitationLinkSchema),
  });

  const isModalOpen = isOpen && options.type === "create-inviation-link";
  const validity = watch("validity");
  const users = watch("maxUsers");

  const generateInvitaionLinkHandler = async (values: TNewInvitationLink) => {
    if (!values.validity) {
      setError("validity", { message: "Member not found" });
      return;
    }
    if (!values.maxUsers) {
      setError("maxUsers", { message: "Member not found" });
      return;
    }

    const res = await createInvitationLinkAction({
      serverId:
        options.type === "create-inviation-link" && options.data.serverId
          ? options.data.serverId
          : serverId,
      channelId:
        options.type === "create-inviation-link" && options.data.channelId
          ? options.data.channelId
          : null,
      data: values,
    });
    if (res.status !== 200 || !res.data) {
      toast.error(res.message);
      return;
    }
    setLink(`${process.env.NEXT_PUBLIC_SITE_URL}/invite/${res.data.token}`);
  };

  console.log({ member })

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      {isServerDataFetching || !member ? (
        <DialogContent className="rounded-[2px] w-[26rem] bg-discord flex justify-center items-center h-72">
          <PuffLoader color="#fff" />
        </DialogContent>
      ) : link ? (
        <DialogContent className="bg-discord px-5">
          <DialogHeader className="text-xl font-medium uppercase">
            INVITATION LINK
          </DialogHeader>
          <div className="flex flex-col gap-y-2">
            <Label className="text-base font-medium uppercase mt-1">
              Send this link to a friend
            </Label>
            <div className="flex items-center justify-between bg-discord_darkest p-1 rounded-[3px]">
              <p className="pl-2 text-sm">
                {"https://aokura-connect.vercel.app/invite/asdfghjklo"}
              </p>
              <Button
                onClick={() => {
                  copy(link || "sdck");
                  toast.success("Link copied to clipboard");
                }}
                className="ml-2"
              >
                COPY
              </Button>
            </div>
            <div className="flex gap-x-1">
              <p className="text-xs font-medium text-white/50">
                This link is valid for next 7 days.
              </p>
              <button className="text-xs text-discord_default hover:underline">Edit</button>
            </div>
          </div>
        </DialogContent>
      ) : (
        <DialogContent className="rounded-[2px] bg-discord w-[26rem]">
          <DialogHeader className="text-xl font-medium uppercase">
            CREATE INVITE LINK
          </DialogHeader>
          <form
            onSubmit={handleSubmit(generateInvitaionLinkHandler)}
            className="flex flex-col gap-y-2"
          >
            <DropdownGeneric<TInvitationLinkValidityKeys>
              currentValue={validity}
              selectHandler={(value) => setValue("validity", value)}
              values={validLinkDatesKeys}
              label="Validity"
              hasError={errors.validity?.message ? true : false}
            />
            <DropdownGeneric<TInvitationLinkMaxUsersKeys>
              currentValue={users}
              selectHandler={(value) => setValue("maxUsers", value)}
              values={maxUsersCountArray}
              label="Max users"
              hasError={errors.maxUsers?.message ? true : false}
            />
            <Button type="submit" className="mt-3">
              {isLoading ? <BarLoader color="#fff" /> : "GENERATE"}
            </Button>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default CreateInvitaionLinkModal;

type TDropdownGeneric<T> = {
  currentValue: string | number | null;
  label: string;
  hasError: boolean;
  values: {
    key: T;
    value: string | number;
  }[];
  selectHandler: (value: T) => void;
};

const DropdownGeneric = <T extends string | number>({
  currentValue,
  values,
  label,
  hasError,
  selectHandler,
}: TDropdownGeneric<T>) => {
  return (
    <DropdownMenu>
      <Label
        className={cn(
          "text-base font-medium uppercase mt-1",
          hasError && "text-red-500"
        )}
      >
        {label}
      </Label>
      <DropdownMenuTrigger className="bg-discord_darker px-3 py-2 rounded-[3px] text-start">
        {values.find((item) => item.key === currentValue)?.value || "SELECT"}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[23rem] rounded-[3px]">
        {values.map((item, index) => (
          <DropdownMenuItem key={index} onClick={() => selectHandler(item.key)}>
            {item.value}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
