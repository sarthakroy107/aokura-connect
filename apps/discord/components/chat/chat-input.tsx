"use client";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ModalEnum, useModal } from "@/lib/store/modal-store";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import useCurrentServer from "../hooks/use-current-member";
import InReply from "./in-reply";
import { useChatActions } from "@/lib/store/chat-store";
import { useSocket } from "@/components/provider/socket-provider";
import useJWT from "../hooks/use-jwt";

type TChatInputProps = {
  name: string;
  type: "channel" | "me";
  serverId: string;
  channelId: string;
};

type TMessage = {
  messageData: {
    textMessage?: string | null | undefined;
    fileUrl?: string | null | undefined;
    inReplyTo?: string | null | undefined;
    memberId: string;
  };
  channelId: string;
  token: string;
};

const formSchema = z
  .object({
    textMsg: z.string().optional(),
    fileUrl: z.string().optional(),
    inReplyTo: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.textMsg && !data.fileUrl) {
        return false;
      }
      return true;
    },
    {
      path: ["textMsg"],
      message: "Message text content and file_url both are empty",
    }
  );

const ChatInput = ({ name, type, serverId, channelId }: TChatInputProps) => {
  const { onOpen, file_url, data, setFileUrl } = useModal();
  const { inReply, senderName, messageId, eraceReplyData } = useChatActions();
  const { socket: io } = useSocket();
  const { token } = useJWT();

  const { member } = useCurrentServer();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isSubmitting) return;

    try {
      if (inReply && !messageId) {
        toast.error("essage id not found in reply message");
        throw new Error("Something went wrong in reply message");
      } else if (inReply && messageId) {
        values.inReplyTo = messageId;
      }

      file_url && (values.fileUrl = file_url);

      if (!member || !member.id) {
        throw new Error("Member not found");
      }

      if (!values.textMsg && !values.fileUrl) return;

      if (!io) {
        throw new Error("Socket not found");
      }

      io.emit("event:message", {
        token,
        messageData: {
          textMessage: values.textMsg,
          fileUrl: values.fileUrl,
          inReplyTo: values.inReplyTo,
          memberId: data.member?.id,
        },
        channelId,
      } as TMessage);

      form.reset({
        textMsg: "",
        fileUrl: "",
      });

      setFileUrl(null);

      toast.success("Message sent");
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
        {inReply && messageId && senderName && (
          <InReply senderName={senderName} messageId={messageId} />
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
          name="textMsg"
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
                    disabled={isSubmitting}
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
