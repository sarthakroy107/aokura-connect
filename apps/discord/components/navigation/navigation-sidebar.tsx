import { ScrollArea } from "@ui/components/ui/scroll-area";
import { getProfileJoinedServers } from "@/lib/server-actions/server/get-joined-servers";
import { Separator } from "@ui/components/ui/separator";
import CreateServerIcon from "@/app/(protected)/channel/_components/create-server-icon";
import JoinServer from "@/app/(protected)/channel/_components/join-server-icon";
import SidebarServerIdon from "./sidebar-server-icon";
import ThemeToggle from "../theme/theme-switcher";
import SignOutButton from "@/app/(protected)/channel/_components/signout";


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
    <div className="w-[72px] h-screen bg-[#1E1F22] flex flex-col justify-between">
      <SidebarServerIdon key={'me'} server={{
        id: 'me',
        name: 'DMs',
        avatar: '/aokura-connect.svg'
      }} />
      
      <Separator className="mx-1 w-[60px] bg-white/10" />
      <ScrollArea className="w-[72px] h-[88%] bg-[#1E1F22]">
        {data.servers?.map((server) => {
          return <SidebarServerIdon key={server.id} server={server} />;
        })}
        <Separator className="mx-1 w-[60px] bg-white/10" />
        <CreateServerIcon profile={data.profile} />
        <JoinServer />
      </ScrollArea>
      <div className="pb-2">
        <ThemeToggle />
        <SignOutButton />
      </div>
    </div>
  );
};

export default NavigationSidebar;
