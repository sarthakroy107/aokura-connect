"use client";
import { useEffect, useState } from "react";
import getConversationDetails from "./_actions/get-conversation-details";

export default function DemiClient({ channelId }: { channelId: string }) {
  const [conversationDetails, setConversationDetails] = useState<any>(null);
  const [fuckMe, setFuckMe] = useState<any>();

  useEffect(() => {
    (async () => {
      const res = await getConversationDetails(channelId);
      setConversationDetails(res);
    })();
  }, [channelId]);

  useEffect(() => {
    (async () => {
      const fetchrRes = await fetch("/api/something", {
        cache: "no-store",
        method: "POST",
        body: JSON.stringify({
          channelId,
        }),
      });
      setFuckMe(await fetchrRes.json())
    })();
  }, [channelId]);

  return (
    <div className="absolute top-20 right-20 space-3">
      <div>
        {conversationDetails && conversationDetails.data ? (
          <div className="border border-rose-600 mb-3">
            <p>Server action working in client component without react query</p>
            <p>ConversationId: {conversationDetails.data.id}</p>
            <p>IsBlocked: {conversationDetails.data.block.isBlocked}</p>
          </div>
        ) : (
          <p>Fuck 1, not again...</p>
        )}
      </div>
      <div className="border border-red-600">
        {fuckMe && fuckMe.data ? (
          <div>
            <p>Server action working in client component without react query</p>
            <p>ConversationId: {fuckMe.data.id}</p>
            <p>IsBlocked: {fuckMe.data.block.isBlocked}</p>
          </div>
        ) : (
          <p>Fuck 2, not again...</p>
        )}
      </div>
    </div>
  );
}
