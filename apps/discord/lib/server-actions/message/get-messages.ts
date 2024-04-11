"use server";

import { getMessages } from "@db/data-access/messages/get-messages";
import getDirectMessagesOperation from "@db/data-access/direct-message/get-dms";
import { TGenericMessageBody } from "@db/dto/messages/sender";
type TProps = {
  id: string;
  skip?: number;
  batchSize?: number;
  type: "direct-message" | "server-message";
};
export const getSavedMessages = async ({
  id,
  type,
  batchSize,
  skip,
}: TProps): Promise<{
  messages: TGenericMessageBody[];
  skip: number;
  total: number;
}> => {
  console.time("getSavedMessages");
  if (!id) throw new Error("No conversationId provided");
  const res =
    type === "server-message"
      ? getMessages(id, skip, batchSize)
      : getDirectMessagesOperation(id, skip, batchSize);
  console.timeEnd("getSavedMessages");
  return res;
};
