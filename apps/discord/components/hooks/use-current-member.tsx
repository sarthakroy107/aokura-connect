'use client';
import { useQuery } from '@tanstack/react-query'
import { useCurrentProfile } from '@/components/hooks/use-current-profile'
import { getServerAndMemberDetails } from '@/lib/server-actions/server/actions';

const useCurrentServer = ( serverId: string ) => {

  const { currentProfileData, refetchCurrentProfileData } = useCurrentProfile();

  const { data, refetch, error } = useQuery({
    queryKey:['server', currentProfileData?.id, serverId],
    queryFn: () => getServerAndMemberDetails(serverId, currentProfileData?.id!),
    refetchInterval: false,
  })

  if (error) {
    console.error(error);
  }

  return {
    member: data?.member,
    server: data?.server,
    channel_categories: data?.categories,
    refetchServerData: refetch,
    refetchCurrentProfileData,
    currentProfileData
  }
}

export default useCurrentServer