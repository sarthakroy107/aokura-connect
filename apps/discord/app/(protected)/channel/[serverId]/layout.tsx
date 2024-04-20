import ServerSidebar from "@/components/server/sidebar/server-sidebar";
import hasJoinedServer from "@/lib/server-actions/server/has-joined-server";
import { Suspense } from "react";
import { PuffLoader } from "react-spinners";

const ServersidebarLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string; channelId: string | undefined };
}) => {
  const res = await hasJoinedServer({
    serverId: params.serverId,
    channelId: params.channelId,
  });

  return (
    <div className="w-full flex">
      <Suspense
        fallback={
          <div className="bg-[rgb(40,43,48)] min-w-[220px] max-w-[220px] flex justify-center items-center">
            <PuffLoader color="#fff" />
          </div>
        }
      >
        <ServerSidebar server_id={params.serverId} />
      </Suspense>
      {children}
    </div>
  );
};

export default ServersidebarLayout;
