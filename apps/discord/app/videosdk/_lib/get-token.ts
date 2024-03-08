import { getVideoSDKAuthToken } from "@/lib/auth/get-video-adk-token";

//This is the Auth token, you will use it to generate a meeting and connect to it
export const authToken: string = getVideoSDKAuthToken();

// API call to create a meeting
export const createVideoSDKRoom = async ({ customRoomId }: { customRoomId: string }) => {
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: `${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customRoomId,
    }),
  });
  //Destructuring the roomId from the response
  const { roomId }: { roomId: string } = await res.json();
  return roomId;
};