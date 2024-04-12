"use client";

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ModalEnum, useModal } from "@/lib/store/modal-store";
import { cn } from "@/lib/utils";
import { useChatActions } from "@/lib/store/chat-store";
import { TInsertMessage } from "@db/data-access/messages/create-message";
import { useEffect } from "react";

import InReply from "./in-reply";
import useJWT from "../hooks/use-jwt";
import Image from "next/image";
import useSocketSendMessage from "../hooks/use-socket-send-message";
import useSocketChatInputStatus from "./use-socket-chat-input-status";
import acceptedInvitation from "@/lib/server-actions/conversation/accept-invitation";
import type { TMessageSenderDto } from "@db/dto/messages/message-dto";

type TChatInputProps =
  | {
      name: string;
      type: "direct-message";
      channelId: string;
      isBlocked: boolean;
      senderDetails: TMessageSenderDto;
      hasAccepted: boolean;
      canAccept: boolean;
    }
  | {
      name: string;
      type: "server-message";
      channelId: string;
      isBlocked: boolean;
      senderDetails: TMessageSenderDto;
    };
const ChatInput = (props: TChatInputProps) => {
  const { name, type, channelId, isBlocked, senderDetails } = props;
  const { onOpen, file_url, data, setFileUrl } = useModal();
  const { inReply, replingToMessageData, eraceReplyData } = useChatActions();
  const { token, refetchJWT } = useJWT({ type });

  const form = useForm<TInsertMessage>({
    defaultValues: {
      content: "",
      attachments: [],
    },
  });
  const isSubmitting = form.formState.isSubmitting;

  const { sendMessage } = useSocketSendMessage();
  const { inputDisabled } = useSocketChatInputStatus(isBlocked);

  useEffect(() => {}, [inputDisabled]);

  const onSubmit = async (values: TInsertMessage) => {
    if (isSubmitting) return;

    try {
      if (inReply && !replingToMessageData) {
        toast.error("message id not found in reply message");
        return;
      } else if (inReply && replingToMessageData) {
        values.inReplyTo = replingToMessageData;
      } else {
        values.inReplyTo = null;
      }

      file_url && (values.attachments = [file_url]);

      if (!senderDetails) {
        toast.error("Sender details not found");
        return;
      }

      if (!values.content && !values.attachments) return;

      if (!token) {
        console.log({ token });
        refetchJWT();
        toast.error("Token not found");
        return;
      }

      sendMessage({
        token,
        content: values.content,
        attachments: values.attachments,
        inReplyTo: values.inReplyTo,
        senderDetails,
        channelId,
        type,
      });

      form.reset({
        content: "",
        attachments: [],
      });

      if (
        props.type === "direct-message" &&
        !props.hasAccepted &&
        props.canAccept
      ) {
        fetch(`/api/accept-dm-invitation`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ conversationId: channelId }),
        });
      }

      setFileUrl(null);
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
                    disabled={isSubmitting || isBlocked || inputDisabled}
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
