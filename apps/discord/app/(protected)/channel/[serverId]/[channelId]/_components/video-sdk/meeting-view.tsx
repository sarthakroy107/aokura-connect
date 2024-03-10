"use client";

import ParticipantView from "@/app/videosdk/_components/participants-view";
import { useMeeting } from "@videosdk.live/react-sdk";
import { useState } from "react";
import JoinScreen from "./join-screen";
import { BarLoader } from "react-spinners";
import { Button } from "@ui/components/ui/button";
import {
  LucideMic,
  LucideMicOff,
  LucideMonitorUp,
  LucidePhone,
  LucidePhoneOff,
  LucideVideo,
  LucideVideoOff,
} from "lucide-react";
import { cn } from "@ui/lib/utils";

export default function MeetingView({
  onMeetingLeave,
  channelName,
  roomId,
}: {
  onMeetingLeave: () => void;
  channelName: string;
  roomId: string;
}) {
  const [joinStatus, setJoinStatus] = useState<
    "joining" | "joined" | "error" | "idle"
  >("idle");

  const { join, participants, leave } = useMeeting({
    onMeetingJoined: () => {
      setJoinStatus("joined");
    },
    onMeetingLeft: () => {
      setJoinStatus("idle");
    },
  });
  const handleVoiceJoin = () => {
    setJoinStatus("joined");
    join();
  };

  return (
    <>
      {joinStatus === "joined" ? (
        <div className="w-full h-[57.7rem] bg-black flex flex-col items-center">
          <div className="w-full h-[92%] grid grid-cols-3 items-center justify-center p-1">
            {[...participants.keys()].map((participantId) => (
              <ParticipantView
                participantId={participantId}
                key={participantId}
              />
            ))}
          </div>
          <Controls />
        </div>
      ) : joinStatus === "joining" ? (
        <div className="w-full h-[57.7rem] bg-black flex flex-col justify-center items-center">
          <p className="text-3xl font-medium mb-3">JOINING</p>
          <BarLoader color="#ffffff" />
        </div>
      ) : (
        <JoinScreen
          roomId={roomId}
          channelName={channelName}
          joinVoiceCall={handleVoiceJoin}
        />
      )}
    </>
  );
}

function Controls() {
  const {
    leave,
    toggleMic,
    toggleWebcam,
    toggleScreenShare,
    localMicOn,
    localWebcamOn,
    localScreenShareOn,

  } = useMeeting();

  return (
    <div className="mt-2 space-x-3 flex">
      <div>
        
      </div>
      <Button
        className={cn(
          "font-medium w-12 h-12 rounded-full flex justify-center items-center border-2",
          localMicOn
            ? "border-white bg-transparent hover:bg-transparent"
            : "border-primary bg-primary"
        )}
        onClick={() => toggleMic()}
      >
        {localMicOn ? (
          <LucideMic width={64} height={64} />
        ) : (
          <LucideMicOff width={64} height={64} />
        )}
      </Button>
      <Button
        className={cn(
          "font-medium w-12 h-12 rounded-full flex justify-center items-center border-2",
          localWebcamOn
            ? "border-white bg-transparent hover:bg-transparent"
            : "border-primary bg-primary"
        )}
        onClick={() => toggleWebcam()}
      >
        {localWebcamOn ? (
          <LucideVideo width={64} height={64} />
        ) : (
          <LucideVideoOff width={64} height={64} />
        )}
      </Button>
      <Button
        className={cn(
          "font-medium w-12 h-12 rounded-full flex justify-center items-center border-2",
          localScreenShareOn
            ? "border-primary bg-primary hover:bg-transparent"
            : "border-white bg-transparent"
        )}
        onClick={() => toggleScreenShare()}
      >
        <LucideMonitorUp width={64} height={64} />
      </Button>
      <Button
        onClick={() => leave()}
        className="font-medium bg-red-600 w-12 h-12 rounded-full flex justify-center items-center"
      >
        <LucidePhone className="rotate-[135deg]" width={64} height={64} />
      </Button>
    </div>
  );
}
