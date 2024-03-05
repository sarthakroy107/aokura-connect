import { ScrollArea } from "@ui/components/ui/scroll-area";
import { getProfileJoinedServers } from "@/lib/server-actions/server/get-joined-servers";
import { Separator } from "@ui/components/ui/separator";
import CreateServerIcon from "@/app/(protected)/channel/_components/create-server-icon";
import JoinServer from "@/app/(protected)/channel/_components/join-server-icon";
import SidebarServerIdon from "./sidebar-server-icon";
import ThemeToggle from "../theme/theme-switcher";

const NavigationSidebar = async () => {
  const data = await getProfileJoinedServers();

  if (data.status !== 200 || !data.servers || !data.profile) {
    return (
      <p className="text-white/50 text-xs text-wrap">
        status: {data.status} message: {data.message}
      </p>
    );
  }

  return (
    <ScrollArea className="w-[72px] h-screen bg-[#1E1F22]">
      {data.servers?.map((server) => {
        return <SidebarServerIdon key={server.id} server={server} />;
      })}
      <Separator className="mx-1 w-[60px] bg-white/10" />
      <CreateServerIcon profile={data.profile} />
      <JoinServer />
      <ThemeToggle />
    </ScrollArea>
  );
};

export default NavigationSidebar;
