"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { encode } from "@/lib/server-actions/auth/jwt-token";
import { useParams } from "next/navigation";
import { createJWTForSendingMessage } from "@/lib/server-actions/auth/create-jwt-for-sending-message";

export default function useJWT({ type } : { type: "direct-message" | "server-message" }) {

  const { serverId, channelId} = useParams< { serverId?: string, channelId: string }>();


  const { data, refetch } = useQuery({
    refetchInterval: 1000 * 60 * 3,
    queryKey: [
      "jwt",
      type,
      channelId,
    ],
    refetchIntervalInBackground: true,
    refetchOnMount: true,
    queryFn: async () =>
      await createJWTForSendingMessage({
        channelId,
        serverId,
        type,
      }),
  });

  if (!data || data.status !== 200 || !data.token) {
    return {
      token: null,
      refetchJWT: refetch,
    };
  }

  return {
    token: data.token,
    refetchJWT: refetch,
  };
}
