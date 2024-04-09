"use client";
import { currentProfile } from "@/lib/auth/current-user";
import { useQuery } from "@tanstack/react-query";

export const useCurrentProfile = () => {
  const { data, refetch, isFetching, error } = useQuery({
    queryKey: ["current-profile"],
    queryFn: () => currentProfile(),
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 10,
  });

  if (error) console.error(error);

  if (data?.status !== 200 || !data.data) {
    return {
      profile: null,
      refetchProfileData: refetch,
      isProfileDataFetching: isFetching,
    };
  }

  return {
    profile: data.data,
    refetchProfile: refetch,
    isProfileDataFetching: isFetching,
  };
};
