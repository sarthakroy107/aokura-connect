"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ModalEnum, useModal } from "@/lib/store/modal-store";
import { cn } from "@/lib/utils";
import { useChatActions } from "@/lib/store/chat-store";
import { useSocket } from "@/components/provider/socket-provider";
import useCurrentServer from "../hooks/use-current-member";
import InReply from "./in-reply";
import useJWT from "../hooks/use-jwt";
import { TInsertMessage } from "@db/data-access/messages/create-message";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type TChatInputProps = {
  name: string;
  type: "channel" | "me";
  serverId: string;
  channelId: string;
  isBlocked: boolean;
};

const ChatInput = ({
  name,
  type,
  serverId,
  channelId,
  isBlocked,
}: TChatInputProps) => {
  const { onOpen, file_url, data, setFileUrl } = useModal();
  const { inReply, replingToMessageData, eraceReplyData } = useChatActions();
  const { socket: io } = useSocket();
  const { token } = useJWT();
  const { member, refetchServerData } = useCurrentServer(serverId);
  const [inputDisabled, setInputDisabled] = useState(isBlocked);
  const router = useRouter();

  const form = useForm<TInsertMessage>();

  const isSubmitting = form.formState.isSubmitting;

  useEffect(() => {
    if (!io) return;
    io.emit("event:chat-input-join", {
      channel_id: channelId,
    });
    io.on("event:channel-status-changed", (data: boolean) => {
      console.log("channel-status-changed, in CHAT INPUT");
      console.log("OLD state: " + " NEW state: " + data);
      setInputDisabled(data);
      refetchServerData();
      router.refresh();
    });
  }, [io]);

  useEffect(() => {}, [inputDisabled]);

  const onSubmit = async (values: TInsertMessage) => {
    if (isSubmitting) return;

    try {
      if (inReply && !replingToMessageData) {
        toast.error("essage id not found in reply message");
        throw new Error("Something went wrong in reply message");
      } else if (inReply && replingToMessageData) {
        values.inReplyTo = replingToMessageData;
      } else {
        values.inReplyTo = null;
      }

      file_url && (values.attachments = [file_url]);

      if (!member || !member.id) {
        throw new Error("Member not found");
      }

      if (!values.content && !values.attachments) return;
      if (!member) return;

      if (!io) {
        throw new Error("Socket not found");
      }
      if (!token) {
        throw new Error("Token not found");
      }
      console.log({ token });
      io.emit("event:message", {
        token: token || "",
        content: values.content,
        attachments: values.attachments,
        inReplyTo: values.inReplyTo,
        senderMemberDetails: {
          id: member.id,
          name: member.name,
          avatar: member.avatar,
          isBanned: member.isBanned,
          isMuted: member.isMuted,
          isKicked: member.isKicked,
          isLeft: member.isLeft,
          role: member.role,
          joinedOn: member.joinedOn,
        },
        channelId,
      } satisfies TInsertMessage);

      form.reset({
        content: "",
        attachments: [],
      });

      setFileUrl(null);

      //toast.success("Message sent");
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    } finally {
      form.reset();
      eraceReplyData();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[85%] fixed bottom-0 p-1 mb-3 px-3 rounded-xl"
      >
        {inReply && replingToMessageData && (
          <InReply
            senderName={
              replingToMessageData.sender
                ? replingToMessageData.sender.name
                : "Deleted account"
            }
            messageId={replingToMessageData.id}
          />
        )}
        {file_url && (
          <div className="w-full h-48 py-1 bg-disord_lighter">
            <Image
              width={400}
              height={400}
              src={file_url}
              alt="upload"
              className="w-64 h-44 object-contain"
            />
          </div>
        )}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem
              className={cn(
                "w-full px-2 bg-disord_lighter rounded-b-md",
                (!inReply || !file_url) && "rounded-t-md"
              )}
            >
              <FormControl className="w-full">
                <div className="w-full flex text-gray-400">
                  <button
                    type="button"
                    className=""
                    onClick={() => onOpen(ModalEnum.UPLOAD_FILE, {})}
                  >
                    <PlusCircle />
                  </button>
                  <Input
                    disabled={
                      isSubmitting || !member || isBlocked || inputDisabled
                    }
                    {...field}
                    className="w-[80%] bg-disord_lighter border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder={`Message #${name} as ${data.member?.id}`}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
