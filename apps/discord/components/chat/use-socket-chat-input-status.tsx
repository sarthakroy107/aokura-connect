import { useState } from "react";
import { useSocket } from "../provider/socket-provider";

export default function useSocketChatInputStatus(currentStatus: boolean) {
  const { socket } = useSocket();
  const [inputDisabled, setInputDisabled] = useState(currentStatus); 
    if (socket) {
      socket.on("event:channel-status-changed", (data: boolean) => {
        setInputDisabled(data);
      });
    }

  return {
    inputDisabled,
  };
}
