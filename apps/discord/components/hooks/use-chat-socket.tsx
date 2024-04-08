"use client";

import { useSocket } from "../provider/socket-provider";
import { useEffect } from "react";

type TProps = {
  socketEvent: string;
  updateKey: string;
  reactQueryKeys: string[];
};

const useChatSocket = ({ socketEvent, updateKey, reactQueryKeys }: TProps) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;
    console.log("Socket listening for event:: ", socketEvent);
    socket.on(socketEvent, (message: TChatMessageData) => {
      console.log("Socket event received");
      console.log({ message });
    });

    return () => {
      socket.off(socketEvent);
    };
  }, [socket, socketEvent, updateKey, reactQueryKeys]);

  return {
    io: socket,
  }
};

export default useChatSocket;
