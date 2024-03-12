"use client";

import useCurrentServer from "@/components/hooks/use-current-member";
import { useParams } from "next/navigation";

//*This component is used to display a welcome message when a user enters a channel for the first time or reaches the end of the channel's messages

const ChatWelcome = () => {
  const { serverId } = useParams<{serverId: string}>();
  if(!serverId) return <div>Loading...</div>
  const { server } = useCurrentServer(serverId);

  return (
    <main className="w-full text-4xl font-semibold text-center border-b border-white/10 space-y-1 pt-7">
      <p> Welcome to </p>
      <p> {server?.name || "Discord"}'s server </p>
      <p className="text-sm font-normal p-1 pb-3 text-white/50">
        This is the begining of the channel
      </p>
    </main>
  );
};

export default ChatWelcome;
