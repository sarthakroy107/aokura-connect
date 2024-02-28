"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { getMessages } from "@/lib/server-actions/message/actions";

import MessageComponent from "./message-component";
import useChatSocket from "@/components/hooks/useChatSocket";
import MessageLoader from "../loaders/message-loader";
import ChatWelcome from "./chat-welcome";
import { useSocket } from "../provider/socket-provider";

const ChatMessagesClient = () => {
  const { ref, inView } = useInView(); //This is used to detect when the user has reached the end of the messages and trigger a fetch for the next page of messages

  const params = useParams<{ serverId: string; channelId: string }>(); //This is used to get the channelId from the url to fetch the messages for the channel

  const socketEvent = `channel:${params?.channelId}:message`;
  const reactQueryKeys = ["messages", params?.channelId!];

  const scrollRef = useRef<HTMLDivElement>(null); //Create a ref for the last div

  const { socket: io } = useSocket();

  const handleGetMessages = async (props: any) => {
    const messages = await getMessages(
      params?.channelId!,
      props?.pageParam,
      20
    );
    return messages;
  };

  //*React Query is used to fetch the messages for the channel
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: reactQueryKeys,
    initialPageParam: 0,
    queryFn: handleGetMessages,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage?.skip >= lastPage?.total) {
        return undefined;
      }
      return lastPage?.skip;
    },
    select: (data) =>
      data.pages
        .flatMap((page) => page.messages)
        .slice()
        .reverse(),
    staleTime: 1000 * 60 * 3,
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  io?.on('event:broadcast-message', (data) => {
    console.log("Broadcast message from server: ", data);
  
  })

  //?This have to be changed
  useChatSocket({ socketEvent, reactQueryKeys, updateKey: "messages" });

  useEffect(() => {
    //*Triggers fetching nextPage messages
    console.log({ hasNextPage });
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    //*This is used to position view point when new messages are fetched
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "instant", block: "end" });
    }
  }, []);

  useEffect(() => {
    if (io) {
      io.emit("event:join", {
        channel_id: params?.channelId,
      });
    }

    return () => {
      if (io) {
        io.emit("event:leave", {
          channel_id: params?.channelId,
        });
      }
    };

  }, [io, params?.channelId]);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      {!hasNextPage && <ChatWelcome />}
      <div ref={ref} />
      {isFetching && hasNextPage && (
        <div className="w-full flex flex-col justify-center items-center">
          <MessageLoader />
        </div>
      )}
      {data.map((item) => (
        <MessageComponent key={item.id} {...item} />
      ))}
      <div ref={scrollRef} />
    </div>
  );
};

export default ChatMessagesClient;
