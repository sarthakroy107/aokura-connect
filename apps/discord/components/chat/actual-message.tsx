"use client";

import { Dispatch, memo, useEffect } from "react";
import Image from "next/image";
import { Textarea } from "@ui/components/ui/textarea";
import { useForm, UseFormReturn } from "react-hook-form";
import TooltipWrapper from "../common/tooltip-wrapper";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/components/ui/popover";
import { TMessageBodyDto } from "@db/dto/messages/message-dto";
import { Separator } from "@ui/components/ui/separator";
import { formatJoinedOnDate } from "@/lib/transformations/date-formater";
import { Input } from "@ui/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import getProfileFromMemberIdAction from "@/lib/member/get-profile-from -member";
import { MoonLoader } from "react-spinners";
import dmFromServerChannelAction from "@/lib/server-actions/conversation/dm-from-group";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import useCurrentServer from "../hooks/use-current-member";

const ActualMessage = memo(
  ({
    form,
    isEditing,
    setIsEditing,
    isMessageDeleting,
    isDeleted,
    senderProfile,
  }: {
    form: UseFormReturn<TTransformedMessage>;
    isEditing: boolean;
    setIsEditing: Dispatch<React.SetStateAction<boolean>>;
    isMessageDeleting: boolean;
    isDeleted: boolean;
    senderProfile: TMessageBodyDto["sender"];
  }) => {
    const { text_content, file_url, sender, created_at, updated_at } =
      form.getValues();

    const onEditSubmit = async (values: {
      text_content: string | null;
      file_url: string | null;
      updated_at: string;
    }) => {
      setIsEditing(false);
      if (
        text_content !== values.text_content ||
        file_url !== values.file_url
      ) {
        form.setValue("updated_at", new Date().toISOString());
      }
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 2000);
      });
      values.updated_at = new Date().toISOString();
      console.log("submitting");
      form.reset();
    };

    const currentTextContent = form.watch("text_content");
    const lastUpdatedAt = form.watch("updated_at");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Escape") {
        form.reset();
        setIsEditing(false);
      } else if (e.key === "Enter") {
        form.handleSubmit(onEditSubmit)();
      }
    };
    useEffect(() => {
      console.log("Re-rendered", isDeleted);
    }, [isDeleted]);

    return (
      <div className="w-full flex gap-x-3">
        <div className="mt-[2px]">
          <Image
            src={
              sender.avatar
                ? sender.avatar
                : "https://i.ibb.co/GQ8CTsZ/1aa7e647b894e219e42cc079d8e54e18.jpg"
            }
            alt={sender.nickname}
            width={64}
            height={64}
            draggable={false}
            className="rounded-full object-cover h-10 w-10"
          />
        </div>
        <div className="w-[95%] relative">
          <div className="w-full justify-between flex gap-x-3">
            <div className="flex gap-x-2 text-white/80">
              <NameHoverCard {...senderProfile} />
              <p className="text-xs text-white text-opacity-40 mt-0.5">
                {created_at}
              </p>
            </div>
          </div>
          {isDeleted ? (
            <i className="text-white/50 text-sm">Message has been deleted</i>
          ) : isEditing && !form.formState.isSubmitting ? (
            <form
              onSubmit={form.handleSubmit(onEditSubmit)}
              className="text-sm text-white text-opacity-75 mt-[2px] my-1"
            >
              <Textarea
                onKeyDown={handleKeyDown}
                disabled={form.formState.isSubmitting}
                className="max-w-[690px] h-10 bg-[#202225] rounded-[3px] outline-none focus-visible:ring-offset-0 focus-visible:ring-0"
                {...form.register("text_content")}
              />
              <div className="flex pl-1 mt-0.5 text-xs text-white/50">
                <span>
                  Esc to{" "}
                  <button
                    type="button"
                    onClick={() => {
                      form.reset();
                      setIsEditing(false);
                    }}
                    className="text-blue-400 hover:underline"
                  >
                    cancel
                  </button>
                </span>
                &nbsp; &middot; &nbsp;
                <span>
                  Enter to{" "}
                  <button
                    type="submit"
                    className="text-blue-400 hover:underline"
                  >
                    save
                  </button>
                </span>
              </div>
            </form>
          ) : (
            <p className="text-sm text-start text-white text-opacity-75 mt-[2px] my-1">
              {currentTextContent} &nbsp;{" "}
              {updated_at !== lastUpdatedAt && "(edited)"}
            </p>
          )}
          {file_url && (
            <div className={cn("group/delete w-fit mt-1 relative")}>
              {!isMessageDeleting && (
                <div className="hidden group-hover/delete:flex justify-center items-center bg-discord hover:bg-red-500 absolute right-1.5 top-1.5 cursor-pointer rounded-sm">
                  <TooltipWrapper label="Delete" side="top">
                    <Trash2 className="m-1" />
                  </TooltipWrapper>
                </div>
              )}
              <Image
                width={900}
                height={750}
                src={file_url}
                alt="upload"
                draggable={false}
                className="h-56 w-fit object-cover rounded-sm"
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default ActualMessage;

const NameHoverCard = ({
  name,
  id,
  avatar,
  created_at,
}: TNameHoverCard) => {
  const params = useParams<{ serverId: string; channelId: string }>();
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<{ textMessage: string }>();
  const member = useCurrentServer(params.serverId);
  const { data } = useQuery({
    queryKey: ["profile", id],
    queryFn: () => getProfileFromMemberIdAction(id),
    staleTime: 1000 * 60 * 10,
  });

  const onSubmit = async ({ textMessage }: { textMessage: string }) => {
    if (!textMessage) return;
    if(!data?.data?.id) return;
    console.log(textMessage);
    const res = await dmFromServerChannelAction({
      receiverProfileId: data.data.id,
      textContent: textMessage,
    });
    if (!res.data || res.status !== 200) {
      toast.error(res.error as string);
      return;
    }
    reset({});
    router.push(`/channel/me/${res.data.conversationId}`);
  };

  return (
    <Popover onOpenChange={() => reset({})}>
      <PopoverTrigger className="text-sm font-medium hover:underline cursor-pointer">
        {name}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="bg-discord_darker rounded-sm p-0 w-96 overflow-hidden relative"
      >
        {!data || data.status !== 200 || !data.data ? (
          <div className="py-8 flex justify-center">
            <MoonLoader size={32} color="#FFF" />
          </div>
        ) : (
          <>
            <div className="bg-yellow-500 w-full h-16 mb-11" />
            <div className="p-1.5 bg-discord_darker w-fit h-fit rounded-full absolute left-3 top-7">
              <Image
                src={avatar}
                alt="Profile image"
                width={69}
                height={69}
                draggable={false}
                className="w-16 h-16 rounded-full"
              />
            </div>
            <div className="flex flex-col gap-y-1 mx-3.5 rounded-md p-2 px-3.5 bg-black text-sm mb-4">
              <p className="text-base font-medium px-1.5">{name}</p>
              <p>@{data.data.username}</p>
              <Separator className="my-1" />
              <div className="py-1 mb-3">
                <p className="text-white/60 font-medium">
                  AOKURA CONNECT SINCE
                </p>
                <p className="text-white/70">
                  {formatJoinedOnDate(created_at)}
                </p>
              </div>
              {member &&
                member.member &&
                member.member.id !== id && (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                      placeholder={`Message @${data.data.username}`}
                      {...register("textMessage")}
                    />
                  </form>
                )}
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

type TNameHoverCard = {
  name: string;
  id: string;
  avatar: string;
  created_at: string;
};
