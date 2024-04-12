"use client";
import { TAPIProfile } from "@/app/api/profile/route";
import { currentProfile } from "@/lib/auth/current-user";
import { useQuery } from "@tanstack/react-query";

export const useCurrentProfile = () => {
  const { data, refetch, isFetching, error } = useQuery({
    queryKey: ["current-profile"],
    queryFn: () =>
      fetch("/api/profile", { method: "GET" }).then((res) => {
        const data = res.json();
        if (res.status !== 200) {
          throw new Error("Failed to fetch profile data");
        }
        return res.json() as Promise<TAPIProfile>;
      }),
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 10,
  });

  if (error) {
    return {
      profile: null,
      refetchProfileData: refetch,
      isProfileDataFetching: isFetching,
    };
  }

  // if (data?.status !== 200 || !data.data) {
  //   return {
  //     profile: null,
  //     refetchProfileData: refetch,
  //     isProfileDataFetching: isFetching,
  //   };
  // }

  return {
    profile: data,
    refetchProfile: refetch,
    isProfileDataFetching: isFetching,
  };
};
