import ServerSidebar from "@/components/server/sidebar/server-sidebar";
import hasJoinedServer from "@/lib/server-actions/server/has-joined-server";

const ServersidebarLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string; channelId: string | undefined };
}) => {
  const res = await hasJoinedServer({ serverId: params.serverId, channelId: params.channelId});

  return (
    <div className="w-full flex">
      <ServerSidebar server_id={params.serverId} />
      {children}
    </div>
  );
};

export default ServersidebarLayout;
