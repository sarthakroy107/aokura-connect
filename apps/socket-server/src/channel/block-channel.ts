import { changeChannelStatusOperation } from "../../../../packages/db/src/data-access/channel/change-channel-status.js";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;

export type TChangeChannelStatus = {
  newState: boolean;
  channelId: string;
};
export const chnageChannelStatus = async ({
  channelId,
  newState,
}: TChangeChannelStatus) => {
  try {
    const res = await changeChannelStatusOperation({
      newState,
      channelId,
    });
    return res;
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error,
    };
  }
};
