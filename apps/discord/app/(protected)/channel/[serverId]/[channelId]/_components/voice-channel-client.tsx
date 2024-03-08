"use client";

import { useState } from "react";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import { authToken } from "@/app/videosdk/_lib/get-token";
import { getVideoSDKRoomId } from "../_lib/video-sdk/get-room-id";
import MeetingView from "./video-sdk/meeting-view";
import JoinScreen from "./video-sdk/join-screen";
import useCurrentServer from "@/components/hooks/use-current-member";

function VideoChannelClient({
  roomId,
  channelName,
  username,
}: {
  roomId: string;
  channelName: string;
  username: string;
}) {
  const [isJoined, setIsJoined] = useState(true);

  const handleVoiceJoin = () => {
    setIsJoined(true);
    console.log("Joining voice call");
    console.log(isJoined);
  };

  //Getting the meeting id by calling the api we just wrote
  // const getMeetingAndToken = async (id?: string) => {
  //   const roomId = await getVideoSDKRoomId({
  //     customRoomId,
  //   });
  //   setMeetingId(roomId);
  // };

  // //This will set Meeting Id to null when meeting is left or ended
  const onMeetingLeave = () => {
    setIsJoined(false);
  };
  if (!roomId) return <div>Failed to create room</div>;
  console.log("In Video Channel Client");
  return (
    <MeetingProvider
      config={{
        meetingId: 'nztc-bzej-b4q9',
        micEnabled: false,
        webcamEnabled: false,
        name: username,
      }}
      token={authToken}
    >
      <MeetingView meetingId={roomId} onMeetingLeave={onMeetingLeave} />
    </MeetingProvider>
  );
}

export default VideoChannelClient;
