"use client";

import { Dispatch, memo, useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useCurrentProfile } from "../hooks/use-current-profile";
import Image from "next/image";
import type { TAPIDMFromServerReturnType } from "@/app/api/dm-from-server/route";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/components/ui/popover";
import { Textarea } from "@ui/components/ui/textarea";
import { LucideFile, Trash2 } from "lucide-react";
import { cn } from "@ui/lib/utils";
import { Separator } from "@ui/components/ui/separator";
import { formatJoinedOnDate } from "@/lib/transformations/date-formater";
import { Input } from "@ui/components/ui/input";
import { MoonLoader } from "react-spinners";
import { toast } from "sonner";
import TooltipWrapper from "../common/tooltip-wrapper";
import type { TSenderBody } from "@db/dto/messages/sender";

type TProps = {
  form: UseFormReturn<TTransformedMessage>;
  isEditing: boolean;
  setIsEditing: Dispatch<React.SetStateAction<boolean>>;
  isMessageDeleting: boolean;
  isDeleted: boolean;
  senderProfile: TSenderBody | null;
  inReplyTo: {
    id: string;
    content: string;
    attachments: string[];
    sender: TSenderBody | null;
    createdAt: string;
    lastEditedOn: string;
  } | null;
};

const ActualMessage = memo(
  ({
    form,
    isEditing,
    setIsEditing,
    isMessageDeleting,
    isDeleted,
    senderProfile,
    inReplyTo,
  }: TProps) => {
    const { content, attachments, sender, createdAt, lastEditedOn } =
      form.getValues();

    const onEditSubmit = async (values: {
      content: string | null;
      attachments: string[] | null;
      lastEditedOn: string;
    }) => {
      setIsEditing(false);
      if (content !== values.content || attachments !== values.attachments) {
        form.setValue("lastEditedOn", new Date().toISOString());
      }
      values.lastEditedOn = new Date().toISOString();
      console.log("submitting");
      form.reset();
    };

    const currentTextContent = form.watch("content");
    const lastUpdatedAt = form.watch("lastEditedOn");

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
      <div className="w-full">
        {inReplyTo && inReplyTo.sender && (
          <InReplyToComponent
            username={inReplyTo.sender.username || ""}
            name={inReplyTo.sender.name || ""}
            text={inReplyTo.content}
            hasMedia={inReplyTo.attachments.length > 0}
            avatar={inReplyTo.sender?.avatar || ""}
            profileId={inReplyTo.sender?.id || ""}

          />
          // <InReplyToComponent
          //   username={"Mai"}
          //   name={"Sakuta"}
          //   text={"Hello, how are you?"}
          //   hasMedia={true}
          //   avatar={
          //     "https://i.ibb.co/GQ8CTsZ/1aa7e647b894e219e42cc079d8e54e18.jpg"
          //   }
          //   id="1"
          // />
        )}
        <div className="w-full flex gap-x-3">
          {sender && (
            <div className="mt-[2px]">
              <Image
                src={
                  sender.avatar
                    ? sender.avatar
                    : "https://i.ibb.co/GQ8CTsZ/1aa7e647b894e219e42cc079d8e54e18.jpg"
                }
                alt={sender.name}
                width={64}
                height={64}
                draggable={false}
                className="rounded-full object-cover h-10 w-10"
              />
            </div>
          )}
          <div className="w-[95%] relative">
            <div className="w-full justify-between flex gap-x-3">
              <div className="flex gap-x-2 text-white/80">
                {senderProfile && (
                  <NameHoverCard
                    {...senderProfile}
                    triggerText={senderProfile.name}
                  />
                )}
                <p className="text-xs text-white text-opacity-40 mt-0.5">
                  {createdAt}
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
                  {...form.register("content")}
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
                {lastEditedOn !== lastUpdatedAt && "(edited)"}
              </p>
            )}
            {attachments && (
              <div className={cn("group/delete w-fit mt-1 relative")}>
                {!isMessageDeleting && (
                  <div className="hidden group-hover/delete:flex justify-center items-center bg-discord hover:bg-red-500 absolute right-1.5 top-1.5 cursor-pointer rounded-sm">
                    <TooltipWrapper label="Delete" side="top">
                      <Trash2 className="m-1" />
                    </TooltipWrapper>
                  </div>
                )}
                {attachments.map((imageURL, index) => (
                  <Image
                    key={index}
                    width={900}
                    height={750}
                    src={imageURL}
                    alt="upload"
                    draggable={false}
                    className="h-56 w-fit object-cover rounded-sm"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

function InReplyToComponent({
  username,
  text,
  name,
  hasMedia,
  avatar,
  profileId,
}: {
  username: string;
  name: string;
  text: string;
  hasMedia: boolean;
  avatar: string;
  profileId: string;
}) {
  return (
    <div className="text-xs text-slate-100/60 flex cursor-pointer">
      <div className="w-5 h-3 mt-1.5 mr-1 ml-4 border-l-2 border-t-2 rounded-tl-sm  border-slate-100/50"></div>
      <Image
        src={avatar}
        alt="Profile image"
        width={24}
        height={24}
        draggable={false}
        className="rounded-full w-4 h-4 mr-1 mb-1.5"
      />
      <div className="flex gap-1">
        <NameHoverCard
          triggerText={`@${username}`}
          avatar={avatar}
          id={profileId}
          popovertriggerClassName="text-xs -mt-1.5 italic text-slate-100/70"
        />{" "}
        {name}
      </div>
      <p className="hover:text-slate-100/90 mx-1"> {text}</p>{" "}
      {hasMedia && <LucideFile height={15} width={15} className="stroke-2" />}
    </div>
  );
}

type TNameHoverCard = {
  triggerText?: string | undefined;
  id: string;
  avatar: string;
  popovertriggerClassName?: string;
  popoverContentClassName?: string;
};

const NameHoverCard = ({
  triggerText,
  id,
  avatar,
  popoverContentClassName,
  popovertriggerClassName,
}: TNameHoverCard) => {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<{ textMessage: string }>();
  const { profile } = useCurrentProfile();

  const onSubmit = async ({ textMessage }: { textMessage: string }) => {
    if (!textMessage) return;
    if (!profile?.id) return;
    console.log(textMessage);
    const res = await fetch("api/dm-from-server", {
      method: "POST",
      body: JSON.stringify({ textMessage, profile }),
    });
    const data: TAPIDMFromServerReturnType = await res.json();
    if (res.status !== 200 || !data.success || !data.conversationId) {
      toast.error(data.message);
      return;
    }
    reset({});
    router.push(`/channel/me/${data.conversationId}`);
  };

  return (
    <Popover onOpenChange={() => reset({})}>
      <PopoverTrigger
        className={cn(
          "text-sm font-medium hover:underline cursor-pointer",
          popovertriggerClassName
        )}
      >
        {triggerText}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn(
          "bg-discord_darker rounded-sm p-0 w-96 overflow-hidden relative",
          popoverContentClassName
        )}
      >
        {!profile ? (
          <div className="py-8 flex justify-center items-center">
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
              <p className="text-base font-medium px-1.5">{profile.name}</p>
              <p>@{profile.usernaeme}</p>
              <Separator className="my-1" />
              <div className="py-1 mb-3">
                <p className="text-white/60 font-medium text-sm">
                  AOKURA CONNECT MEMBER SINCE
                </p>
                <p className="text-white/80 text-base mt-0.5">
                  {formatJoinedOnDate(profile.created_at)}
                </p>
              </div>
              {profile && profile.id !== id && (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Input
                    placeholder={`Message @${profile.usernaeme}`}
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

export default ActualMessage;
