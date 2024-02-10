'use client'
import { currentProfile } from "@/lib/auth/current-user"
import { useQuery } from "@tanstack/react-query"

export const useCurrentProfile = () => {
  const {data, refetch } = useQuery({
    queryKey: ['current-profile'],
    queryFn: () =>  currentProfile(),
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })

  return {
    currentProfileData: data,
    refetchCurrentProfile: refetch,
  }
}