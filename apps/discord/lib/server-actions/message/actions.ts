"use server";

import { eq } from "drizzle-orm";
import { db } from "@db/db";
import { Message } from "@db/schema";
import { transformMessageData } from "../../transformations/message";

const MESSAGE_BATCH = 10;

export const createMessage = async (
  content: string,
  file_url: string,
  sender_member_id: string,
  channel_id: string
) => {
  try {

    const newMessage = await db
      .insert(Message)
      .values({ content, file_url, sender_member_id, channel_id })
      .returning();

    return newMessage[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getMessages = async (channel_id: string) => {
  try {
    
    const messages = await db.query.Message.findMany({
      where: eq(Message.channel_id, channel_id),
      with: {
        sender: {
          with: {
            profile: true,
          },
        },
      },
    });

    const transformedMessages = messages.map((message) =>
      transformMessageData(message)
    );

    return {
      messages: transformedMessages,
      nextCursor: MESSAGE_BATCH,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};