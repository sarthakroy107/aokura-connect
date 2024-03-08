'use client';

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export const useChannel = () => {
  const { channelId, serverId } = useParams<{ serverId: string, channelId: string }>();
  const {} = useQuery({
    queryKey: ["channel", { serverId, channelId }],
    queryFn: () => {
      // fetch channel data
    }
  })
}