import ChannelNavbar from "@/components/channel/channel-nav";
import ChatMessages from "@/components/chat/chat-messages-server";
import { getChannelById } from "@/lib/server-actions/channel/actions";
import VoiceChannel from "./_components/voice-channel";
import ChannelMessageChatInput from "./channel-chat-input";

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
          <ChatMessages id={params.channelId} type="server-message" />
          {/* <ChannelMessageChatInput
            channelId={params.channelId}
            serverId={params.serverId}
          /> */}
        </>
      )}
      {channel.type === "voice" && (
        <VoiceChannel channelId={channel.id} channelName={channel.name} />
      )}
    </div>
  );
};

export default Page;