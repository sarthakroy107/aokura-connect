"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { encode } from "@/lib/server-actions/auth/jwt-token";
import { useParams } from "next/navigation";
import { createJWTForSendingMessage } from "@/lib/server-actions/auth/create-jwt-for-sending-message";

export default function useJWT() {
  const session = useSession();

  const { serverId, channelId } = useParams<{
    serverId: string;
    channelId: string;
  }>();

  if (!session.data?.user.profile_id)
    throw new Error("Profile ID not found from use-jwt");

  if (
    !serverId ||
    !channelId ||
    !session.data?.user.email ||
    !session.data.user.username
    
  ) {
    return {
      token: null,
      refetchJWT: () => {},
    };
  }
  const { data, refetch } = useQuery({
    refetchInterval: 1000 * 60 * 3,
    queryKey: [
      "jwt",
      session.data?.user.email,
      session.data?.user.id,
      serverId,
      channelId,
    ],
    refetchIntervalInBackground: true,
    refetchOnMount: true,
    queryFn: async () =>
      await createJWTForSendingMessage({
        email: session.data.user.email || "",
        username: session.data.user.username || "",
        profileId: session.data.user.profile_id || "",
        memberId: session.data.user.id,
        serverId,
        channelId,
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
