
import ChannelNavbar from "@/components/channel/channel-nav";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages-server";
import { getChannelById } from "@/lib/server-actions/channel/actions";
import VoiceChannel from "./_components/voice-channel";

const Page = async ({
  params,
}: {
  params: { serverId: string; channelId: string };
}) => {
  const channel = await getChannelById(params.channelId);
  if (!channel) return <div>Channel not found</div>;

  return (
    <div className="w-full bg-discord h-full">
      <ChannelNavbar
        id={channel.name}
        name={channel.name}
        type={channel.type}
      />
      {channel.type === "text" && (
        <>
          <ChatMessages channel_id={params.channelId} />
          <ChatInput
            serverId={params.serverId}
            channelId={params.channelId}
            type="channel"
            name={channel.name}
          />
        </>
      )}
      {channel.type === "voice" && (
        <VoiceChannel channelId={channel.id} channelName={channel.name}/>
      )}
    </div>
  );
};

export default Page;


// import Video from '@/app/videosdk/vide-component'
// import React from 'react'

// const Page = () => {
//   return (
//     <Video />
//   )
// }

// export default Page
