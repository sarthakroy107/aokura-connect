import { useSocket } from "../provider/socket-provider";
import { toast } from "sonner";
import { TInsertMessage } from "@db/data-access/messages/create-message";

export default function useSocketSendMessage() {
  const { socket } = useSocket();
  const sendMessage = (message: TInsertMessage) => {
    console.log("Sending message");
    console.log({ message });
    if (socket) {
      socket.emit("event:send-message", message);
    }
    else toast.error("Socket is not connected");
  };

  return {
    sendMessage,
  };
}