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

import { messageBodyDto } from "@/lib/transformations/message";
import { useChatActions } from "@/lib/store/chat-store";
import TooltipWrapper from "../common/tooltip-wrapper";
import useCurrentServer from "../hooks/use-current-member";


const ChatActions = memo(
  ({
    data,
    setIsEditing,
    setIsDeleting,
  }: {
    data: ReturnType<typeof messageBodyDto>;
    setIsEditing: Dispatch<SetStateAction<boolean>>;
    setIsDeleting: Dispatch<SetStateAction<boolean>>;
  }) => {
    const { member } = useCurrentServer();
    const setReply = useChatActions(useShallow((state) => state.setReply));

    return (
      <div className="flex p-0.5 bg-disord_lighter rounded-sm gap-x-0.5 text-white/30">
        {member?.id === data.sender.member_id && (
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
              copy(data.text_content || "");
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
              setReply(data);
            }}
            className="hover:bg-white/20 rounded-sm p-1"
          >
            <LucideReply className="h-5 w-5" />
          </div>
        </TooltipWrapper>
        {member?.id === data.sender.member_id && (
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
