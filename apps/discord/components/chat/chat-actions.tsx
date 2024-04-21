"use client";

import { Dispatch, SetStateAction, memo } from "react";
import { useShallow } from "zustand/react/shallow";

import copy from "clipboard-copy";
import { toast } from "sonner";
import {
  LucideCopy,
  LucidePencil,
  LucideReply,
  LucideTrash2,
} from "lucide-react";

import { useChatActions } from "@/lib/store/chat-store";
import { useCurrentProfile } from "../hooks/use-current-profile";
import TooltipWrapper from "../common/tooltip-wrapper";
import { TGenericMessageBody } from "@db/dto/messages/sender";

const ChatActions = memo(
  ({
    data,
    setIsEditing,
    setIsDeleting,
  }: {
    data: TGenericMessageBody;
    setIsEditing: Dispatch<SetStateAction<boolean>>;
    setIsDeleting: Dispatch<SetStateAction<boolean>>;
  }) => {
    const { profile } = useCurrentProfile();
    const setReply = useChatActions(useShallow((state) => state.setReply));
    
    return (
      <div className="flex p-0.5 bg-disord_lighter rounded-sm gap-x-0.5 text-white/30">
        {profile?.id === data.sender?.id && (
          <TooltipWrapper label="Edit" align="center" side="top">
            <div
              onClick={() => setIsEditing(true)}
              className="hover:bg-white/20 rounded-sm p-1"
            >
              <LucidePencil className="h-5 w-5" />
            </div>
          </TooltipWrapper>
        )}
        <TooltipWrapper label="Copy" align="center" side="top">
          <div
            onClick={() => {
              copy(data.content || "");
              toast.success("Copied to clipboard");
            }}
            className="hover:bg-white/20 rounded-sm p-1"
          >
            <LucideCopy className="h-5 w-5" />
          </div>
        </TooltipWrapper>
        <TooltipWrapper label="Reply" align="center" side="top">
          <div
            onClick={() => {
              console.log(data.sender?.username)
              console.log(data);
              setReply(data);
            }}
            className="hover:bg-white/20 rounded-sm p-1"
          >
            <LucideReply className="h-5 w-5" />
          </div>
        </TooltipWrapper>
        {profile?.id === data.sender?.id && (
          <TooltipWrapper label="Delete" align="center" side="top">
            <div
              onClick={() => setIsDeleting(true)}
              className="hover:bg-white/20 rounded-sm p-1"
            >
              <LucideTrash2 className="h-5 w-5 text-rose-600" />
            </div>
          </TooltipWrapper>
        )}
      </div>
    );
  }
);

export default ChatActions;
