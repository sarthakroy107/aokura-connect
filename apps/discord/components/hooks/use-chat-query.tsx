'use client';

import { useSocket } from "@/components/provider/socket-provider";

type TProps = {
  channelId: string;
  eventId: string;
  paylaod: {
    text?: string;
    image?: string;
  }
}

const useChatQuery = ({ channel_id,}: {channel_id: string}) => {
  const { socket } = useSocket();
  
}

export default useChatQuery