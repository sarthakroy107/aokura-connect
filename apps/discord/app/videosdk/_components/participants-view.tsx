"use client";

import TooltipWrapper from "@/components/common/tooltip-wrapper";
import { cn } from "@/lib/utils";
import { useParticipant } from "@videosdk.live/react-sdk";
import Image from "next/image";
import { memo, useEffect, useMemo, useRef } from "react";
import ReactPlayer from "react-player";

export default function ParticipantView({
  participantId,
}: {
  participantId: string;
}) {
  const micRef = useRef<HTMLAudioElement>(null);
  const screenShareAudioRef = useRef<HTMLAudioElement>(null);
  const {
    webcamStream,
    micStream,
    webcamOn,
    micOn,
    isActiveSpeaker,
    isLocal,
    displayName,
    screenShareOn,
    screenShareStream,
    screenShareAudioStream,
    //@ts-ignore
    metaData,
  } = useParticipant(participantId); //metaData exists

  console.log("Metadata", metaData);

  const webcamVideoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  const screenShareVideoStream = useMemo(() => {
    if (screenShareOn && screenShareStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(screenShareStream.track);
      return mediaStream;
    }
  }, [screenShareStream, screenShareOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
    if (screenShareAudioRef.current) {
      if (screenShareOn && screenShareAudioStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(screenShareAudioStream.track);

        screenShareAudioRef.current.srcObject = mediaStream;
        screenShareAudioRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        screenShareAudioRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn, screenShareAudioStream, screenShareOn]);

  return (
    <div
      key={participantId}
      className="w-full aspect-video relative rounded-[3px] overflow-hidden"
    >
      <audio ref={micRef} autoPlay muted={isLocal} />
      {screenShareOn && (
        <audio ref={screenShareAudioRef} autoPlay muted={isLocal} />
      )}
      {webcamOn && screenShareOn && (
        <ParticipantWithBothVideoOn
          name={metaData?.name}
          username={displayName}
          webcamVideoStream={webcamVideoStream}
          screenShareVideoStream={screenShareVideoStream}
        />
      )}
      {webcamOn && !screenShareOn && (
        <ParticipantWithOneVideoStream
          username={displayName}
          name={metaData?.name}
          videoStream={webcamVideoStream}
          isActiveSpeaker={isActiveSpeaker}
        />
      )}
      {!webcamOn && screenShareOn && (
        <ParticipantWithOneVideoStream
          username={displayName}
          name={metaData?.name}
          videoStream={screenShareVideoStream}
          isActiveSpeaker={isActiveSpeaker}
        />
      )}
      {!webcamOn && !screenShareOn && (
        <ParticipantWithAllVideoOffCard
          isActiveSpeaker={isActiveSpeaker}
          avatar={metaData?.avatar}
          name={metaData?.name}
          username={displayName}
          isLocal={isLocal}
        />
      )}
    </div>
  );
}

const ParticipantWithAllVideoOffCard = memo(
  ({
    avatar,
    name,
    username,
    isLocal,
    isActiveSpeaker,
  }: {
    avatar: string;
    name: string;
    username: string;
    isLocal: boolean;
    isActiveSpeaker: boolean;
  }) => {
    return (
      <div
        className={cn(
          "w-full h-full border rounded-[3px] bg-zinc-500 flex justify-center items-center relative",
          isActiveSpeaker ? "border-primary" : "border-white"
        )}
      >
        <TooltipWrapper label={username}>
          <Image
            src={avatar}
            alt={name}
            width={125}
            height={125}
            className="rounded-full w-16 h-16"
            draggable={false}
          />
        </TooltipWrapper>
        <p className="absolute left-1 bottom-1 bg-black/25 rounded-[3px] px-1 py-0.5">
          {name}
        </p>
      </div>
    );
  }
);

const ParticipantWithOneVideoStream = memo(
  ({
    username,
    name,
    videoStream,
    isActiveSpeaker,
  }: {
    username: string;
    name: string;
    videoStream: MediaStream | undefined;
    isActiveSpeaker: boolean;
  }) => {
    return (
      <div
        className={cn(
          "w-full h-full border",
          isActiveSpeaker && "border-primary"
        )}
      >
        <ReactPlayer
          //
          playsinline // extremely crucial prop
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          //
          url={videoStream}
          //
          height={"100%"}
          width={"100%"}
          onError={(err) => {
            console.log(err, "participant video error");
          }}
        />
        <p className="absolute bottom-1 left-1 bg-black/20 p-0.5 px-1 rounded-[2px">
          {name}
        </p>
      </div>
    );
  }
);

const ParticipantWithBothVideoOn = memo(
  ({
    name,
    username,
    webcamVideoStream,
    screenShareVideoStream,
  }: {
    name: string;
    username: string;
    webcamVideoStream: MediaStream | undefined;
    screenShareVideoStream: MediaStream | undefined;
  }) => {
    return (
      <div className={cn("w-full h-full relative")}>
        <div className="w-full h-full">
          <ReactPlayer
            playsinline
            pip={false}
            light={false}
            controls={false}
            muted={true}
            playing={true}
            url={screenShareVideoStream}
            height={"100%"}
            width={"100%"}
            onError={(err) => {
              console.log(err, "participant video error");
            }}
          />
        </div>
        <p className="absolute bottom-1 left-1 px-1 py-0.5 bg-black/20 rounded-[3px]">
          {name}
        </p>
        <div className="w-16 aspect-video rounded-[2px] absolute right-1 bottom-1">
          <ReactPlayer
            playsinline
            pip={false}
            light={false}
            controls={false}
            muted={true}
            playing={true}
            url={webcamVideoStream}
            height={"100%"}
            width={"100%"}
            onError={(err) => {
              console.log(err, "participant video error");
            }}
          />
        </div>
      </div>
    );
  }
);
