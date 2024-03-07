"use client";

import {
  LiveKitRoom,
  VideoConference,
  formatChatMessageLinks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { RoomConnectOptions } from "livekit-client";
import { Room } from "livekit-server-sdk";
import { useMemo } from "react";
import { toast } from "sonner";

export default function VoiceChannelClient({
  username,
  roomId,
  token,
}: {
  username: string;
  roomId: string;
  token: string;
}) {
  const room = useMemo(() => new Room({}), []);
  const connectOptions = useMemo((): RoomConnectOptions => {
    return {
      autoSubscribe: true,
    };
  }, []);
  return (
    <div className="w-full flex justify-center">
      <LiveKitRoom
        token={token}
        connectOptions={connectOptions}
        video={true}
        audio={false}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        data-lk-theme="default"
        onDisconnected={() => toast.message("Disconnected from room")}
        style={{ height: "92.5vh" }}
      >
        <VideoConference chatMessageFormatter={formatChatMessageLinks} />
      </LiveKitRoom>
    </div>
  );
}
