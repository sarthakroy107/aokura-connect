"use client";

import { TAPIProfile } from "@/app/api/profile/route";
import { useQuery } from "@tanstack/react-query";

export const useCurrentProfile = () => {
  const { data, refetch, isFetching, error } = useQuery({
    queryKey: ["current-profile"],
    queryFn: async () => {
      const res = await fetch("/api/profile", { method: "GET" });
      if (!res.ok) {
        throw new Error("Failed to fetch profile data");
      }
      const profile = await res.json();
      if (!profile) {
        throw new Error("No profile data found");
      }
      //*Don't use return await res.json() or .then(res => res.json()) because it does not work
      return profile as TAPIProfile;
    },
    refetchInterval: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  if (error) {
    return {
      profile: null,
      refetchProfileData: refetch,
      isProfileDataFetching: isFetching,
    };
  }
  return {
    profile: data,
    refetchProfile: refetch,
    isProfileDataFetching: isFetching,
  };
};
