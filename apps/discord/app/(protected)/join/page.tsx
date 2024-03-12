import getServerInformation from "@/lib/server-actions/server/get-server-details";
import { cn } from "@/lib/utils";
import Image from "next/image";
import JoinServerButton from "./join-server";

export default async function Page({
  searchParams: { sid, cid, rpid },
}: {
  searchParams: { sid: string; cid: string; rpid: string };
}) {

  if (!sid) {
    return (
      <main className="w-full h-screen flex justify-center p-12 text-ellipsis bg-discord_blurple">
        <div className={cn("auth-box")}>Server ID is needed</div>
      </main>
    );
  }

  const server = await getServerInformation(sid);

  if (!server.success || !server.data) {
    return (
      <main className="w-full h-screen flex justify-center p-12 text-ellipsis bg-discord_blurple">
        <div className={cn("auth-box")}>{server.message}</div>
      </main>
    );
  }

  return (
    <main className="w-full h-screen flex justify-center p-12 text-ellipsis bg-discord_blurple">
      <div className={cn("auth-box")}>
        <Image
          src={server.data.avatar as string}
          alt="Discord Logo"
          draggable={false}
          width={120}
          height={120}
          className="object-cover w-28 h-28 p-1 rounded-full"
        />
        {/* <Separator className="bg-zinc-300/10 my-3" /> */}
        <h2 className="text-3xl font-medium">{server.data?.name}</h2>
        <JoinServerButton serverId={sid} channelId={cid} />
      </div>
    </main>
  );
}
