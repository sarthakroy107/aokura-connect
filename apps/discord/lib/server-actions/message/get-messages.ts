"use server";

import { getMessages } from "@db/data-access/messages/get-messages";
import { TGenericMessageBody } from "@db/dto/messages/sender";
import getDirectMessagesOperation from "@db/data-access/direct-message/get-dms";


export type TGetSavedMessagesProps = {
  id: string;
  skip?: number;
  batchSize?: number;
  type: "direct-message" | "server-message";
};
export type TGetSavedMessagesReturnType = {
  messages: TGenericMessageBody[];
  skip: number;
  total: number;
}


export const getSavedMessages = async ({
  id,
  type,
  batchSize,
  skip,
}: TGetSavedMessagesProps): Promise<TGetSavedMessagesReturnType> => {

  const res =
    type === "server-message"
      ? getMessages(id, skip, batchSize)
      : getDirectMessagesOperation(id, skip, batchSize);
  return res;
};


