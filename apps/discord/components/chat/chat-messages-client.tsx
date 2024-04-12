"use client";

import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import MessageComponent from "./message-component";
import MessageLoader from "../loaders/message-loader";
import ChatWelcome from "./chat-welcome";
import useSocketMessages from "./use-socket-messages";
import Loading from "@/loading";
import { TPOSTMessages } from "@/app/api/messages/route";

const ChatMessagesClient = ({
  type,
}: {
  type: "direct-message" | "server-message";
}) => {
  const { ref, inView } = useInView(); //This is used to detect when the user has reached the end of the messages and trigger a fetch for the next page of messages

  const params = useParams<{ serverId: string; channelId: string }>(); //This is used to get the channelId from the url to fetch the messages for the channel

  const scrollRef = useRef<HTMLDivElement>(null); //Create a ref for the last div

  const handleGetMessages = async (props: any) => {
    const res = await fetch("/api/messages", {
      method: "PUT",
      cache: "no-cache",
      body: JSON.stringify({
        id: params?.channelId!,
        type,
        batchSize: 20,
        skip: props.pageParam ?? 0,
      }),
    });

    const data = (await res.json()) as TPOSTMessages;
    if (!data.messages) {
      throw new Error(data.error);
    } else return data;
  };

  //*React Query is used to fetch the messages for the channel
  const { data, fetchNextPage, hasNextPage, isFetching, error } =
    useInfiniteQuery({
      queryKey: ["messages", params?.channelId!],
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
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    });

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

  const { socketMessages } = useSocketMessages(params?.channelId!);

  if(isFetching) return <Loading />;

  return (
    <>
      {error ? (
        <div>{error.message}: skjvnjbfhdd</div>
      ) : data && (
        <div>
          {!hasNextPage && type === "server-message" && <ChatWelcome />}
          <div ref={ref} />
          {isFetching && hasNextPage && (
            <div className="w-full flex flex-col justify-center items-center">
              <MessageLoader />
            </div>
          )}
          {data.map((item) => (
            <MessageComponent key={item.id} {...item} />
          ))}
          {socketMessages.map((item) => (
            <MessageComponent key={item.id} {...item} />
          ))}
          <div ref={scrollRef} />
        </div>
      )}
    </>
  );
};

export default ChatMessagesClient;
