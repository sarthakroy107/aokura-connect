import { currentProfile } from "@/lib/auth/current-user";
import { getVideoSDKRoomId } from "../_lib/video-sdk/get-room-id";
import ClientWrapper from "./client-wrapper";

export default async function VoiceChannel({
  channelId,
  channelName,
}: {
  channelId: string;
  channelName: string;
}) {
  const profile = await currentProfile();
  const roomId = await getVideoSDKRoomId({ customRoomId: channelId });

  if (!roomId) return <div>Failed to create room</div>;

  if (profile.status !== 200 || !profile.data) return <div>Not logged in</div>;

  return (
    <ClientWrapper //*This is a important component which does nothing. Without it, VideoSDK react provider may give hydration error
      channelName={channelName}
      roomId={roomId}
      username={profile.data.usernaeme}
    />
  );
}
