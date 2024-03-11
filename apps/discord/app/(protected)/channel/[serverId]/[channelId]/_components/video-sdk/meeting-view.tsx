"use client";

import ParticipantView from "@/app/videosdk/_components/participants-view";
import { useMeeting } from "@videosdk.live/react-sdk";
import { useMemo, useState } from "react";
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

  const participantCount = useMemo(() => participants.size, [participants]);

  return (
    <>
      {joinStatus === "joined" ? (
        <div className={"w-full h-[95.4%] z-30 bg-black flex flex-col items-center"}>
          <div
            className={cn(
              "w-full h-[92%] grid items-center justify-center p-5",
              participantCount === 1 && "grid-cols-1",
              participantCount === 2 && "grid-cols-2",
              participantCount >= 3 && "grid-cols-3",
            )}
          >
            {[...participants.keys()].map((participantId) => (
              <ParticipantView
                className={cn(participantCount === 1 ? "min-h-[95%] mx-auto" : "w-full")}
                participantId={participantId}
                key={participantId}
              />
            ))}
          </div>
          <Controls />
        </div>
      ) : joinStatus === "joining" ? (
        <div className="w-full h-[95.4%] bg-black flex flex-col justify-center items-center">
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
    <div className="space-x-3 pt-2 flex">
      <div></div>
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
