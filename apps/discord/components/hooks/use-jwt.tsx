"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { TAPIJWTToken } from "@/app/api/token/route";

export default function useJWT({
  type,
}: {
  type: "direct-message" | "server-message";
}) {
  const { serverId, channelId } = useParams<{
    serverId?: string;
    channelId: string;
  }>();

  const { data, refetch, error } = useQuery({
    refetchInterval: 1000 * 60 * 3,
    queryKey: ["jwt", type, channelId],
    refetchIntervalInBackground: true,
    refetchOnMount: true,
    queryFn: () =>
      fetch(
        `/api/token?channel_id=${channelId}&server_id=${serverId}&type=${type}`
      ).then((res) => {
        if (!res.ok || res.status !== 200) {
          throw new Error("Failed to fetch JWT");
        }
        return res.json() as Promise<TAPIJWTToken>;
      }),
  });

  if (error) {
    return {
      token: null,
      refetchJWT: refetch,
      error,
    };
  }

  if (!data || !data.token) {
    return {
      token: null,
      refetchJWT: refetch,
      error: "No token found",
    };
  }

  return {
    token: data.token,
    refetchJWT: refetch,
    error: null,
  };
}
