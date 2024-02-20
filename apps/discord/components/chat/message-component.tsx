"use client";

import { memo, useState } from "react";
import { useForm } from "react-hook-form";

import { transformMessageData } from "@/lib/transformations/message";

import ChatActions from "./chat-actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@ui/components/ui/alert-dialog";
import { cn } from "@ui/lib/utils";
import ActualMessage from "./actual-message";
import { ScrollArea } from "@ui/components/ui/scroll-area";

const MessageComponent = memo(
  (props: ReturnType<typeof transformMessageData>) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isMessageDeleting, setIsMessageDeleting] = useState(false);

    const form = useForm<TTransformedMessage>({
      defaultValues: props,
    });

    const handleDeleteFunction = () => {
      try {
        form.setValue("file_url", "");
        form.setValue("text_content", "");
        form.setValue("is_deleted", true);
      } catch (error) {}
    };

    const isDeleted = form.watch("is_deleted");

    return (
      <div
        className={cn(
          "group/action w-full hover:bg-[#303236] flex gap-x-2.5 px-5 py-1.5 my-1.5 relative",
          isEditing && "bg-[#303236]"
        )}
      >
        <ActualMessage
          isDeleted={isDeleted}
          isMessageDeleting={isMessageDeleting}
          form={form}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
        {!isEditing && (
          <div className="absolute right-10 -top-5 hidden hover:block group-hover/action:block text-black shadow-sm shadow-black/20">
            <ChatActions
              data={props}
              setIsEditing={setIsEditing}
              setIsDeleting={setIsMessageDeleting}
            />
          </div>
        )}
        {
          <AlertDialog
            open={isMessageDeleting}
            onOpenChange={() => setIsMessageDeleting(false)}
          >
            <div className="absolute right-0 -top-5 hidden group-hover/edit:block text-black shadow-sm shadow-black/20">
              <ChatActions
                data={props}
                setIsEditing={setIsEditing}
                setIsDeleting={setIsMessageDeleting}
              />
            </div>
            <AlertDialogContent className="bg-discord p-0 rounded-[3px]">
              <AlertDialogHeader className="my-7">
                <AlertDialogTitle className="text-2xl">
                  Delete Message
                </AlertDialogTitle>
                <AlertDialogDescription className="mb-3">
                  This action can not be undone
                </AlertDialogDescription>
                <ScrollArea className="mx-5 p-2 max-h-80 rounded-[2px] border border-black/15 shadow-sm shadow-black/10">
                  <ActualMessage
                    isMessageDeleting={isMessageDeleting}
                    isDeleted={isDeleted}
                    form={form}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                  />
                </ScrollArea>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex items-center bg-discord_darker px-7 py-3">
                <AlertDialogCancel className="bg-disord_darker shadow-none border-0 hover:underline hover:bg-discord_darker">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteFunction}
                  className="mt-1.5 bg-red-500 text-white rounded-[3px] hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        }
      </div>
    );
  }
);

export default MessageComponent;
