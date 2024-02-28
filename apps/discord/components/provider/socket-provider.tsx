"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { updateSession } from "@/lib/server-actions/auth/jwt-token";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (session.data && session.data.jwt) {
      (async () => {
        console.log("Connecting to socket server");
        const socketInstance = io("http://localhost:6700", {
          auth: {
            token: await updateSession(session.data.jwt), // Updating the JWT token
          },
        });

        socketInstance.on("connect", () => {
          setIsConnected(true);
          setSocket(socketInstance);
        });

        socketInstance.on("disconnect", () => {
          setIsConnected(false);
        });
      })();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
