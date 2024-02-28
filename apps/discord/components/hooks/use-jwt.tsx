"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { encode } from "@/lib/server-actions/auth/jwt-token";

export default function useJWT() {
  const session = useSession();

  const { data, refetch } = useQuery({
    refetchInterval: 1000 * 60 * 3,
    queryKey: ["jwt", session.data?.user.email, session.data?.user.id],
    refetchIntervalInBackground: true,
    refetchOnMount: true,
    queryFn: async () =>
      await encode({
        email: session.data?.user.email,
        id: session.data?.user.id,
        username: session.data?.user.username,
      }),
  });

  return {
    token: data,
    refetchJWT: refetch,
  };
}
