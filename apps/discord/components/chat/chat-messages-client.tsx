"use client";

import { getMessages } from "@/lib/server-actions/message/actions";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useInView } from "react-intersection-observer";

import MessageComponent from "./message-component";
import useChatSocket from "../hooks/useChatSocket";
import { Fragment, useEffect, useRef, useState } from "react";
import { transformMessageData } from "@/lib/transformations/message";

const ChatMessagesClient = () => {
  const { ref, inView } = useInView();
  const params = useParams<{ serverId: string; channelId: string }>();
  const socketEvent = `channel:${params?.channelId}:message`;
  const reactQueryKeys = ["messages", params?.channelId!];

  const scrollRef = useRef<HTMLDivElement>(null); // Create a ref for the last div
  const [messages, setMessages] = useState< Array<ReturnType<typeof transformMessageData>>>([]);

  const handleGetMessages = async (props: any) => {
    const messages = await getMessages(
      params?.channelId!,
      props?.pageParam,
      20
    );
    return messages;
  };

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: reactQueryKeys,
    initialPageParam: 0,
    queryFn: handleGetMessages,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage?.skip >= lastPage?.total - 1) {
        console.log("No More Pages, fuck fuck fuck fuck fuck");
        return undefined;
      }
      return lastPage?.skip;
    },
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  useChatSocket({ socketEvent, reactQueryKeys, updateKey: "messages" });


  useEffect(() => {
    console.log({ hasNextPage });
    if (inView && hasNextPage) {
      console.log("Fetching Next Page");
      fetchNextPage();
      console.log("Next Page fetched");
    }
  }, [inView]);


  useEffect(() => {
    console.log({ data });
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "instant", block: "end" });
    }
  }, [data]);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <div ref={ref} />
      {data.pages.toReversed().map((d, index) => (
        <Fragment key={index}>
          {d.messages.toReversed().map((message, index) => (
            <MessageComponent key={index} {...message} />
          ))}
          <div ref={index === 0 ? scrollRef : null} />
        </Fragment>
      ))}
    </div>
  );
};

export default ChatMessagesClient;
