'use client';
import { useChatActions } from "@/lib/store/chat-store";
import { LucideXCircle } from "lucide-react";

const InReply = ({
  senderName,
  messageId,
}: {
  senderName: string | null;
  messageId: string;
}) => {
  const { eraceReplyData } = useChatActions();
  return (
    <div className="w-full bg-discord_darker text-xs text-white/40 px-2 pt-1 rounded-t-md flex justify-between">
      <p>
        Replying to{" "}
        <span className="text-white/75 font-medium text-sm cursor-pointer">{senderName}</span>
      </p>
      <button type="button" onClick={eraceReplyData}>
        <LucideXCircle className="hover:text-white/70 cursor-pointer" />
      </button>
    </div>
  );
};

export default InReply;
