import { ScrollArea } from "@/components/ui/scroll-area";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

import ChatMessagesClient from "./chat-messages-client";
import { getSavedMessages } from "@/lib/server-actions/message/get-messages";

const ChatMessages = async ({
  id,
  type,
}: {
  id: string;
  type: "direct-message" | "server-message";
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: [type, id],
    queryFn: () =>
      getSavedMessages({
        channel_id: id,
        skip: 0,
        batchSize: 20,
        type: "server-message",
      }),
    initialPageParam: 0,
  });

  return (
    <ScrollArea className="w-full h-[89vh]">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ChatMessagesClient />
      </HydrationBoundary>
    </ScrollArea>
  );
};

export default ChatMessages;
