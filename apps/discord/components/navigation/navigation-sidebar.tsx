import { currentProfile } from "@/lib/auth/current-user";
import { ScrollArea } from "@ui/components/ui/scroll-area"
import { getServers } from "@/lib/server-actions/server/actions";
import SidebarServerIdon from "./sidebar-server-icon";
import { Separator } from "@ui/components/ui/separator";
import CreateServerIcon from "@/app/(main)/create-server-icon";
import JoinServer from "@/app/(main)/join-server-icon";

const NavigationSidebar = async () => {

  const profile = await currentProfile()
  if (!profile) return null;
  
  const servers = await getServers(profile.id);
  return (
    <ScrollArea className="w-[72px] h-screen bg-[#1E1F22]">
      {
        servers?.map((server => { return <SidebarServerIdon key={server.server_id} server={server.server} /> }))
      }
      <Separator className="mx-1 w-[60px] bg-white/10" />
      <CreateServerIcon profile={profile} />
      <JoinServer />
    </ScrollArea>
  )
}

export default NavigationSidebar