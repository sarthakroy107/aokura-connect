'use client';

import { Dispatch, SetStateAction, memo } from "react";
import { useShallow } from 'zustand/react/shallow'

import  copy  from 'clipboard-copy'
import { toast } from "sonner";
import {
  LucideCopy,
  LucidePencil,
  LucideReply,
  LucideTrash2,
} from "lucide-react";

import { transformMessageData } from "@/lib/transformations/message";
import { useChatActions } from "@/lib/store/chat-store";

const ChatActions = memo(({data, setEditing}: {data: ReturnType<typeof transformMessageData>, setEditing: Dispatch<SetStateAction<boolean>>}) => {

  const setReply = useChatActions(useShallow(state => state.setReply));

  return (
    <div className="flex p-0.5 bg-disord_lighter rounded-sm gap-x-0.5 text-white/30">
      <button type="button" onClick={() => setEditing(true)} className="hover:bg-white/20 rounded-sm p-1">
        <LucidePencil className="h-5 w-5" />
      </button>
      <button onClick={() => {copy(data.text_content || ''); toast.success('Copied to clipboard')}} className="hover:bg-white/20 rounded-sm p-1">
        <LucideCopy className="h-5 w-5" />
      </button>
      <button type="button" onClick={() => { console.table(data); setReply(data)}}  className="hover:bg-white/20 rounded-sm p-1">
        <LucideReply className="h-5 w-5" />
      </button>
      <div className="hover:bg-rose-400/30 rounded-sm p-1">
        <LucideTrash2 className="h-5 w-5 text-rose-600" />
      </div>
    </div>
  );
});

export default ChatActions;
