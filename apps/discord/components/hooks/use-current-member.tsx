"use client";
import { useQuery } from "@tanstack/react-query";
import { useCurrentProfile } from "@/components/hooks/use-current-profile";
import { getServerAndMemberDetails } from "@/lib/server-actions/server/get-server-and-member-details";
import { useParams } from "next/navigation";

const useCurrentServer = () => {
  const {
    currentProfileData,
    refetchCurrentProfileData,
    isCurrentProfileDataFetching,
  } = useCurrentProfile();
  const params = useParams<{ serverId: string }>();

  if (!params || !params.serverId) {
    return {};
  }

  const { data, refetch, error, isFetching } = useQuery({
    queryKey: ["server", currentProfileData?.id, params.serverId],
    queryFn: () => getServerAndMemberDetails(params.serverId),
    refetchInterval: false,
    staleTime: 1000 * 60 * 10,
  });

  if (error) console.error(error);

  if (!data || data?.status !== 200 || !data.data) {
    return {
      member: null,
      server: null,
      channel_categories: null,
      refetchServerData: refetch,
      refetchCurrentProfileData,
      currentProfileData,
      isCurrentProfileDataFetching,
      isServerDataFetching: isFetching,
    };
  }

  return {
    member: data.data.member || null,
    server: data.data.server || null,
    channel_categories: data.data.server.categories,
    refetchServerData: refetch,
    refetchCurrentProfileData,
    currentProfileData,
    isCurrentProfileDataFetching,
    isServerDataFetching: isFetching,
  };
};

export default useCurrentServer;
