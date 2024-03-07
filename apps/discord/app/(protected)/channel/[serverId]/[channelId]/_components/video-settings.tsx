'use client';

import { Room } from "livekit-client";
import { useMemo, useState } from "react";

export default function VideoSettingsBar() {
  const room = useMemo(() => new Room(), []);
  room.localParticipant.setCameraEnabled(true);
  room.localParticipant.setScreenShareEnabled(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
}