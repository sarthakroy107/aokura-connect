"use client";

import { useSession } from "next-auth/react";
import { generateJWT } from "@/lib/server-actions/auth/jwt-token";
import { useQuery } from "@tanstack/react-query";

export default function useJWT() {
  const session = useSession();

  const { data, refetch, isStale } = useQuery({
    refetchInterval: 1000 * 60 * 3,
    queryKey: ["jwt", session.data?.user.email, session.data?.user.id],
    refetchIntervalInBackground: true,
    refetchOnMount: true,
    queryFn: async () => generateJWT({}),
  });

  return {
    token: data?.token,
    refetch,
    isStale,
  };
}
