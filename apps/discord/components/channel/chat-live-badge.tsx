"use client";

import { Badge } from "@ui/components/ui/badge";
import { useSocket } from "../provider/socket-provider";
import { cn } from "@ui/lib/utils";

const ChatLiveBadge = () => {
  const { isConnected } = useSocket();
  
  return (
    <Badge
      className={cn(
        "mr-11 text-white rounded-full",
        isConnected
          ? "bg-green-600 hover:bg-green-600"
          : "bg-rose-600 hover:bg-rose-600"
      )}
    >
      {isConnected ? "Live" : "Offline"}
    </Badge>
  );
};

export default ChatLiveBadge;
