import { currentProfile } from "@/lib/auth/current-user";
import { getLivekitToken } from "../_lib/livekit/get-token";
import VoiceChannelClient from "./voice-channel-client";

export default async function VoiceChannel({
  channelId,
}: {
  channelId: string;
}) {
  const profile = await currentProfile();

  if (profile.status !== 200 || !profile.data) return <div>Not logged in</div>;

  const livekitToken: { token: string } | undefined = await getLivekitToken({
    username: profile.data.usernaeme,
    room: channelId,
  });

  if (!livekitToken) return <div>Failed to get token</div>;
  console.log(livekitToken.token);

  return (
    <section>
      <div className="w-full border border-white bg-discord_darkest flex justify-center items-center">
        {channelId}
      </div>
      <VoiceChannelClient roomId={channelId} username={profile.data.usernaeme} token={livekitToken.token} />
    </section>
  );
}