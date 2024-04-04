import PageNavbar from "@/components/navigation/page-nav";
import { getProfile } from "@db/data-access/user/get-profile";
import getConversationDetails from "./_actions/get-conversation-details";
import Image from "next/image";

export default async function Page({
  params: { conversationId },
}: {
  params: { conversationId: string };
}) {
  const conversationDetails = await getConversationDetails(conversationId);
  
  return (
    <div className="w-full h-full bg-discord">
      {conversationDetails.data && (
        <PageNavbar>
          <div className="h-4 flex items-center gap-x-2">
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
        </PageNavbar>
      )}
      {conversationDetails.data && (
        <div>
          <h1>{conversationDetails.data.to.name}</h1>
        </div>
      )}
    </div>
  );
}
