'use client'
import { currentProfile } from "@/lib/auth/current-user"
import { useQuery } from "@tanstack/react-query"

export const useCurrentProfile = () => {
  const {data, refetch, isFetching } = useQuery({
    queryKey: ['current-profile'],
    queryFn: () =>  currentProfile(),
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 30,
  })

  return {
    currentProfileData: data,
    refetchCurrentProfileData: refetch,
    isCurrentProfileDataFetching: isFetching
  }
}