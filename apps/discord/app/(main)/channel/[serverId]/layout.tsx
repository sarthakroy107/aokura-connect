import ServerSidebar from "@/components/server/sidebar/ServerSidebar"

const ServersidebarLayout = async ({children, params }: { children: React.ReactNode, params: { serverId: string } }) => {

  return (
    <div className="w-full flex">
      <ServerSidebar server_id={params.serverId}  />
      {children}
    </div>
  )
}

export default ServersidebarLayout