"use client";

import useCurrentServer from "@/components/hooks/use-current-member";
import { Button } from "@ui/components/ui/button";
import Loading from "../loading";

export default function JoinScreen({
  roomId,
  channelName,
  joinVoiceCall,
}: {
  roomId: string;
  channelName: string;
  joinVoiceCall: () => void;
}) {
  const { member } = useCurrentServer();

  console.log("In Join Screen");
  if (!member) {
    return <Loading />;
  }

  return (
    <div className="w-full h-[95.4%] bg-black flex flex-col justify-center  items-center">
      <h2 className="text-3xl font-medium text-semibold">{channelName}</h2>
      <p className="text-xs my-2 text-white/70">No one is currently in voice</p>
      <Button
        type="button"
        onClick={joinVoiceCall}
        className="rounded-full w-24 text-lg py-5 font-semibold mt-4"
      >
        JOIN
      </Button>
    </div>
  );
}
