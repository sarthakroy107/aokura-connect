"use server";

import { getMessages } from "@db/data-access/messages/get-messages";

export const getSavedMessages = async (
  channel_id: string,
  skip?: number,
  batchSize?: number
) => {
  return getMessages(channel_id, skip, batchSize);
};
