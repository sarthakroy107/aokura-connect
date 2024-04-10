"use client";

import { useSocket } from "../provider/socket-provider";
import { Badge } from "@ui/components/ui/badge";

export default function SocketStatus() {
  const { isConnected } = useSocket();
  return (
    <Badge variant={isConnected ? "default" : "destructive"} className="rounded-full">
      {isConnected ? "WS: live" : "WS: dead"}
    </Badge>
  );
}
