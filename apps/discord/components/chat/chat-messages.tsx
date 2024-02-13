import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getMessages } from '@/lib/server-actions/message/actions'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import ChatMessagesClient from './chat-messages-client';


const ChatMessages = async ({channel_id}: { channel_id: string}) => {

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['messages', channel_id],
    queryFn: () => getMessages(channel_id, 0, 20),
    initialPageParam: 0,
  })

  return (
    <ScrollArea className='w-full h-[89vh]'>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ChatMessagesClient />
      </HydrationBoundary>
    </ScrollArea>
  )
}

export default ChatMessages