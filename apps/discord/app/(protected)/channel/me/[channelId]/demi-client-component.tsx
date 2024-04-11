'use client';
import { useEffect, useState } from "react";
import getConversationDetails from "./_actions/get-conversation-details";

export default function DemiClient({ channelId }: { channelId: string }) {
  const [conversationDetails, setConversationDetails] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const res = await getConversationDetails(channelId);
      setConversationDetails(res);
    })();
  }, [channelId]);

  return (
    <div className="absolute top-20 right-20">
      {conversationDetails && conversationDetails.data ? (
        <div>
          <p>Server action working in client component without react query</p>
          <p>ConversationId: {conversationDetails.data.id}</p>
          <p>IsBlocked: {conversationDetails.data.block.isBlocked}</p>
        </div>
      ) : (
        <p>Fuck, not again...</p>
      )}
    </div>
  );
}
