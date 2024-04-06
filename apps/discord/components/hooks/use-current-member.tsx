"use client";

import { useQuery } from "@tanstack/react-query";
import { getServerAndMemberDetails } from "@/lib/server-actions/server/get-server-and-member-details";

const useCurrentServer = (serverId: string) => {

  //if(!serverId) throw new Error("Server ID is required");

  const { data, refetch, error, isFetching } = useQuery({
    queryKey: ["server", serverId],
    queryFn: () => getServerAndMemberDetails(serverId),
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
      isServerDataFetching: isFetching,
    };
  }

  return {
    member: data.data.member || null,
    server: data.data.server || null,
    channel_categories: data.data.server.categories,
    refetchServerData: refetch,
    isServerDataFetching: isFetching,
  };
};

export default useCurrentServer;
