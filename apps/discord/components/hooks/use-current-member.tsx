"use client";

import { useQuery } from "@tanstack/react-query";
import { TAPIServerAndMemberDetails } from "@/app/api/server-and-member/route";

const useCurrentServer = (serverId: string) => {
  const { data, refetch, error, isFetching } = useQuery({
    queryKey: ["server", serverId],
    queryFn: async () => {
      if (!serverId) return null;
      const res = await fetch(`/api/server-and-member?server_id=${serverId}`);
      if (!res.ok) {
        console.error("An error occurred while fetching server data");
        return null;
      } else if (res.status !== 200) {
        console.error("An error occurred while fetching server data");
        return null;
      } else return (await res.json()) as TAPIServerAndMemberDetails;
    },
    refetchInterval: false,
    staleTime: 1000 * 60 * 10,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (error) console.error(error);

  if (!data) {
    return {
      member: null,
      server: null,
      channel_categories: null,
      refetchServerData: refetch,
      isServerDataFetching: isFetching,
    };
  }

  return {
    member: data.member || null,
    server: data.server || null,
    channel_categories: data.server.categories,
    refetchServerData: refetch,
    isServerDataFetching: isFetching,
  };
};

export default useCurrentServer;
