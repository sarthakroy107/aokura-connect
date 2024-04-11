import PageNavbar from "@/components/navigation/page-nav";
import getConversationDetails from "./_actions/get-conversation-details";
import Image from "next/image";
import ChatMessages from "@/components/chat/chat-messages-server";
import ChatInput from "@/components/chat/chat-input";
import SocketStatus from "@/components/chat/socket-status";
import DirectMessageChatInput from "./direct-message-input";
import DemiClient from "./demi-client-component";

export default async function Page({
  params: { channelId },
}: {
  params: { channelId: string };
}) {
  const conversationDetails = await getConversationDetails(channelId);

  return (
    <div className="w-full h-full bg-discord">
      {conversationDetails.data && (
        <PageNavbar className="justify-between px-5">
          <div className="h-4 flex justify-between items-center gap-x-2">
            <Image
              src={conversationDetails.data.to.avatar || ""}
              alt={conversationDetails.data.to.name}
              width={40}
              height={40}
              draggable={false}
              className="rounded-full object-cover w-7 h-7"
            />
            <p>{conversationDetails.data.to.name}</p>
          </div>
          <SocketStatus />
        </PageNavbar>
      )}
      {conversationDetails.data && (
        <>
          <ChatMessages id={channelId} type="direct-message" />
          <DemiClient channelId={channelId} />
          <DirectMessageChatInput
            conversationId={conversationDetails.data.id}
            isBlocked={conversationDetails.data.block.isBlocked}
            accepted={conversationDetails.data.status.accepted}
            shouldBeAcceptedBy={
              conversationDetails.data.status.shouldBeAcceptedBy
            }
          />
        </>
      )}
    </div>
  );
}
