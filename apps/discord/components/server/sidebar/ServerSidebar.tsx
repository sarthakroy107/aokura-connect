import CategoryComp from "./category-comp";
import ServersidebarNavbar from "./server-sidebar-nav";
import ServerSearch from "./server-search";

import { channelTypesEnum } from "@db/schema";
import { getServerAndMemberDetails } from "@/lib/server-actions/server/get-server-and-member-details";
import { currentProfile } from "@/lib/auth/current-user";

import { Hash, Shield, ShieldHalf, Speaker, Video } from "lucide-react";

const ServerSidebar = async ({ server_id }: { server_id: string }) => {
  const profile = await currentProfile();

  if (!profile) return null;
  const res = await getServerAndMemberDetails(server_id);

  if (!res || res.status !== 200 || !res.data)
    return <div>Opps! Something wend wrong</div>;

  return (
    <div className="min-w-[220px] max-w-[220px] h-screen overflow-auto bg-[rgb(40,43,48)] text-white">
      <ServersidebarNavbar
        label={res.data.server.name}
        className=""
        member={res.data.member}
      />
      <ServerSearch
        data={[
          {
            label: "Channels",
            type: "channel",
            data: res.data.server.categories.flatMap((category) =>
              category.channels.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon:
                  channel.type === channelTypesEnum.TEXT ? (
                    <Hash />
                  ) : channel.type === channelTypesEnum.VOICE ? (
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
                id: res.data.member.id,
                name: res.data.member.nickname || '',
                icon:
                  res.data.member.role === "admin" ? (
                    <Shield />
                  ) : res.data.member.role === "moderator" ? (
                    <ShieldHalf />
                  ) : null,
              },
            ],
          },
        ]}
      />
      {res.data.server.categories.map((category, index) => (
        <CategoryComp key={index} categoryData={category} />
      ))}
    </div>
  );
};

export default ServerSidebar;
