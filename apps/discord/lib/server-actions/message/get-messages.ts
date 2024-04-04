"use server";

import { getMessages } from "@db/data-access/messages/get-messages";
type TProps = {
  channel_id: string
  skip?: number
  batchSize?: number
  type: "direct-message" | "server-message"
}
export const getSavedMessages = async (
  {channel_id, type,batchSize, skip} : TProps
) => {

  return getMessages(channel_id, skip, batchSize);
};
