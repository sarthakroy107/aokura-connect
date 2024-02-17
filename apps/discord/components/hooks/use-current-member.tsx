'use client';
import { useQuery } from '@tanstack/react-query'
import { useCurrentProfile } from '@/components/hooks/use-current-profile'
import { getServerAndMemberDetails } from '@/lib/server-actions/server/actions';
import { useParams } from 'next/navigation';

const useCurrentServer = ( serverId?: string ) => {

  const { currentProfileData, refetchCurrentProfileData, isCurrentProfileDataFetching } = useCurrentProfile();
  const params = useParams<{ serverId: string }>();

  if(!params || !params.serverId) {
    throw new Error('useCurrentServer must be used within a server route')
  }

  const { data, refetch, error, isFetching } = useQuery({
    queryKey:['server', currentProfileData?.id, params.serverId],
    queryFn: () => getServerAndMemberDetails(params.serverId, currentProfileData?.id!),
    refetchInterval: false,
    staleTime: 1000 * 60 * 10,
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
    currentProfileData,
    isCurrentProfileDataFetching,
    isServerDataFetching: isFetching
  }
}
export default useCurrentServer