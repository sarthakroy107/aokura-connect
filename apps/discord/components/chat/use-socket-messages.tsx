import { useSocket } from "@/components/provider/socket-provider";
import { TMessageBodyDto } from "@db/dto/messages/message-dto";
import { useEffect, useState } from "react";

export default function useSocketMessages(channelId: string | undefined) {
  const { socket: io } = useSocket();
  const [socketMessages, setSocketMessages] = useState<TMessageBodyDto[]>([]);

  useEffect(() => {
    if (!io || !channelId) return;
    if (io) {
      io.emit("event:join", {
        channel_id: channelId,
      });
      io.on("event:broadcast-message", (data: TMessageBodyDto) => {
        console.log("Broadcast message from server: ", data);
        setSocketMessages((prev) => [...prev, data]);
      });
    }

    return () => {
      if (io) {
        io.emit("event:leave", {
          channel_id: channelId,
        });
      }
    };
  }, [io, channelId]);

  return {
    socketMessages,
  };
}
