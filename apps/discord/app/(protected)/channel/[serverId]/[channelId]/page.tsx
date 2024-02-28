import ChannelNavbar from "@/components/channel/channel-nav";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages-server";
import { getChannelById } from "@/lib/server-actions/channel/actions";

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
      <ChatMessages channel_id={params.channelId} />
      {channel.type === "text" && (
        <ChatInput
          serverId={params.serverId}
          channelId={params.channelId}
          type="channel"
          name={channel.name}
        />
      )}
    </div>
  );
};

export default Page;
