import ChatInput from "@/components/chat/chat-input";
import { getServerAndMemberDetails } from "@/lib/server-actions/server/get-server-and-member-details";

export default async function ChannelMessageChatInput({
  serverId,
  channelId,
}: {
  channelId: string;
  serverId: string;
}) {
  const res = await getServerAndMemberDetails(serverId);
  if (!res.data) {
    return null;
  }

  const channelDetails = res.data.server.channels.find(
    (channel) => channel.id === channelId
  );

  if (!channelDetails) {
    return (
      <div className="absolute bottom-3 right-3 text-lg text-red-500">
        Channel Not Found
      </div>
    );
  }


  return (
    <ChatInput
      type="server-message"
      senderDetails={{
        id: res.data.member.profile_id,
        name: res.data.member.name,
        avatar: res.data.member.avatar || "",
        isBanned: res.data.member.isBanned,
        isKicked: res.data.member.isKicked,
        isLeft: res.data.member.isLeft,
        isMuted: res.data.member.isMuted,
        role: res.data.member.role,
        joinedOn: res.data.member.joinedOn,
      }}
      channelId={channelId}
      name="Direct Message"
      isBlocked={channelDetails.isBlocked}
    />
  );
}
