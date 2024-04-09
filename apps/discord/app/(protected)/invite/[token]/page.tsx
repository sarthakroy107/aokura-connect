import getInviteDetailsAction from "@/lib/server-actions/invitation-link/get-invite-details-action";
import Image from "next/image";
import JoinServerButton from "../../join/join-server";

const Page = async ({ params: { token } }: { params: { token: string } }) => {
  if (!token) {
    return (
      <main className="w-full h-full bg-discord_blurple flex justify-center">
        <section className="auth-box mt-12">
          <p>Invalid token</p>
        </section>
      </main>
    );
  }

  const res = await getInviteDetailsAction(token);

  if (!res.success || !res.data) {
    return (
      <main className="w-full h-full bg-discord_blurple flex justify-center">
        <section className="auth-box mt-12">
          <p>{res.message}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="w-full h-full bg-discord_blurple flex justify-center">
      <section className="auth-box mt-12">
        <Image
          src={res.data?.server.avatar || ""}
          alt="Discord Logo"
          draggable={false}
          width={120}
          height={120}
          className="object-cover w-28 h-28 p-1 rounded-full"
        />
        {/* <Separator className="bg-zinc-300/10 my-3" /> */}
        <h2 className="text-3xl font-medium">{res.data.server.name}</h2>
        <JoinServerButton
          serverId={res.data.server.id}
          channelId={res.data.channel?.id}
        />
      </section>
    </main>
  );
};

export default Page;
