'use client';
import { getMessages } from '@/lib/server-actions/message/actions'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation';
import MessageComponent from './message-component';
import useChatSocket from '../hooks/useChatSocket';

const ChatMessagesClient = () => {

  const params = useParams<{serverId: string, channelId: string}>()
  const socketEvent = `channel:${params?.channelId}:message`
  const reactQueryKeys = ['messages', params?.channelId!]

  const { data } = useInfiniteQuery({
    queryKey: reactQueryKeys,
    queryFn: () => getMessages(params?.channelId!),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    refetchInterval: 5*1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })

  useChatSocket({socketEvent, reactQueryKeys, updateKey: 'messages'})

  if (!data) return <div>Loading...</div>
  return (
    <div>
      {
        data.pages.map((d, index) => {
          return d?.messages.map((message, index) => (
            <MessageComponent key={index} {...message} />
          ))
        })
      }
    </div>
  )
}

export default ChatMessagesClient
