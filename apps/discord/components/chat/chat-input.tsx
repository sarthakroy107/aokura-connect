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
import { useRouter } from "next/navigation";

import InReply from "./in-reply";
import useJWT from "../hooks/use-jwt";
import Image from "next/image";
import useCurrentServer from "../hooks/use-current-member";
import useSocketSendMessage from "../hooks/use-socket-send-message";
import useSocketChatInputStatus from "./use-socket-chat-input-status";

type TChatInputProps = {
  name: string;
  type: "server-message" | "direct-message";
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
  const { token, refetchJWT } = useJWT();
  const { member, refetchServerData } = useCurrentServer(serverId);

  const router = useRouter();

  const form = useForm<TInsertMessage>({
    defaultValues: {
      content: "",
      attachments: [],
    },
  });
  const isSubmitting = form.formState.isSubmitting;

  const { sendMessage } = useSocketSendMessage();
  const { inputDisabled } = useSocketChatInputStatus(isBlocked);

  useEffect(() => {
    refetchServerData();
    router.refresh();
  }, [inputDisabled]);

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

      if (!member) {
        toast.error("Member not found");
        return;
      }

      if (!values.content && !values.attachments) return;

      if (!token) {
        console.log({ token })
        refetchJWT();
        toast.error("Token not found");
        return;
      }

      sendMessage({
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
      });

      form.reset({
        content: "",
        attachments: [],
      });

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
