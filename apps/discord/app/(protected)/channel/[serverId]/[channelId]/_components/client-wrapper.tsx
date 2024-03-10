'use client';

import VoiceChannelClient from "./voice-channel-client";

const ClientWrapper = ({
  channelName,
  roomId,
  username,
}: {
  roomId: string;
  channelName: string;
  username: string;
}) => {
  //*This is a dummy client component to wrap the client so that VideoChannelClient does not give error
  return (
    <VoiceChannelClient
      roomId={roomId}
      channelName={channelName}
      username={username}
    />
  );
};

export default ClientWrapper;
