"use client";

import React from "react";
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
  return (
    <VoiceChannelClient
      roomId={roomId}
      channelName={channelName}
      username={username}
    />
  );
};

export default ClientWrapper;
