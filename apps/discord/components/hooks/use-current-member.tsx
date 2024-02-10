'use client';
import { useQuery } from '@tanstack/react-query'
import { useCurrentProfile } from '@/components/hooks/use-current-profile'
import { getServer } from '@/lib/server-actions/servers';

const useCurrentServer = ( serverId: string ) => {

  const { currentProfileData, refetchCurrentProfile } = useCurrentProfile();

  const { data, refetch } = useQuery({
    queryKey:['server', currentProfileData?.id, serverId],
    queryFn: () => getServer(serverId, currentProfileData?.id!),
    refetchInterval: false,
  })
  
  return {
    member: data?.member,
    server: data?.server,
    channel_categories: data?.categories,
    serverDataRefetch: refetch,
    refetchCurrentProfile,
    currentProfileData
  }
}

export default useCurrentServer