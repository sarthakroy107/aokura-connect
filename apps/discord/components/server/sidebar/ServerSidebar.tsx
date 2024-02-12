import { getServerAndMemberDetails } from "@/lib/server-actions/server/actions";
import CategoryComp from "./category-comp";
import ServersidebarNavbar from "./server-sidebar-nav";
import ServerSearch from "./server-search";
import { channelTypesEnum } from "@/lib/schema";
import { Hash, Shield, ShieldHalf, Speaker, Video } from "lucide-react";
import { currentProfile } from "@/lib/auth/current-user";

const ServerSidebar = async ({ server_id }: { server_id: string }) => {
  const profile = await currentProfile();

  if (!profile) return null;
  const data = await getServerAndMemberDetails(server_id, profile?.id);

  if (!data) return <div>Opps! Something wend wrong</div>;

  return (
    <div className="min-w-[220px] max-w-[220px] h-screen overflow-auto bg-[rgb(40,43,48)] text-white">
      <ServersidebarNavbar
        label={data.server.name}
        className=""
        member={data.member}
      />
      <ServerSearch
        data={[
          {
            label: "Channels",
            type: "channel",
            data: data.categories.flatMap((category) =>
              category.channels.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon:
                  channel.channel_type === channelTypesEnum.TEXT ? (
                    <Hash />
                  ) : channel.channel_type === channelTypesEnum.VOICE ? (
                    <Speaker />
                  ) : (
                    <Video />
                  ),
              }))
            ),
          },
          {
            label: "Members",
            type: "member",
            data: [
              {
                id: data.member.id,
                name: "Sarthak Roy",
                icon:
                  data.member.role === "admin" ? (
                    <Shield />
                  ) : data.member.role === "moderator" ? (
                    <ShieldHalf />
                  ) : null,
              },
            ],
          },
        ]}
      />
      {data.categories.map((category, index) => (
        <CategoryComp key={index} data={category} />
      ))}
    </div>
  );
};

export default ServerSidebar;
