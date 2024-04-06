"use client";

import { useState } from "react";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import { authToken } from "@/app/videosdk/_lib/get-token";
import { getVideoSDKRoomId } from "../_lib/video-sdk/get-room-id";
import MeetingView from "./video-sdk/meeting-view";
import JoinScreen from "./video-sdk/join-screen";
import useCurrentServer from "@/components/hooks/use-current-member";
import { useParams } from "next/navigation";

function VideoChannelClient({
  roomId,
  channelName,
  username,
}: {
  roomId: string;
  channelName: string;
  username: string;
}) {
  const { serverId } = useParams<{ serverId: string }>();

  if (!serverId) return <div>Loading...</div>;

  const { member } = useCurrentServer(serverId);
  const [isJoined, setIsJoined] = useState(false);

  const onMeetingLeave = () => {
    setIsJoined(false);
  };
  if (!roomId) return <div>Failed to create room</div>;
  console.log("In Video Channel Client");
  return (
    <>
      {member && (
        <MeetingProvider
          config={{
            meetingId: roomId,
            micEnabled: false,
            webcamEnabled: false,
            name: username,
            metaData: {
              name: member.name,
              avatar: member.avatar,
            },
          }}
          token={authToken}
        >
          <MeetingView
            roomId={roomId}
            channelName={channelName}
            onMeetingLeave={onMeetingLeave}
          />
        </MeetingProvider>
      )}
    </>
  );
}

export default VideoChannelClient;
