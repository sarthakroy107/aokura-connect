import ChatInput from "@/components/chat/chat-input";
import { currentProfile } from "@/lib/auth/current-user";

export default async function DirectMessageChatInput({
  conversationId,
  isBlocked,
  accepted,
  shouldBeAcceptedBy,
}: {
  conversationId: string;
  isBlocked: boolean;
  accepted: boolean;
  shouldBeAcceptedBy: string;
}) {
  const profileRes = await currentProfile();
  if (!profileRes.data) {
    return null;
  }

  return (
    <ChatInput
      type="direct-message"
      senderDetails={{
        id: profileRes.data.id,
        name: profileRes.data.name,
        avatar:
          profileRes.data.avatar ||
          "https://boo-prod.b-cdn.net/database/profiles/169166205572419e2214177a61d9aac65fd109db6951f.jpg",
        isBanned: false,
        isKicked: null,
        isLeft: null,
        isMuted: null,
        role: null,
        joinedOn: profileRes.data.created_at,
      }}
      channelId={conversationId}
      name="Direct Message"
      isBlocked={isBlocked}
      canAccept={profileRes.data.id === shouldBeAcceptedBy}
      hasAccepted={accepted}
      // operarion={async () => {
      //   "use server";
      //   if (!accepted && profileRes.data.id === shouldBeAcceptedBy)
      //     acceptedInvitation(conversationId);
      // }}
    />
  );
}
