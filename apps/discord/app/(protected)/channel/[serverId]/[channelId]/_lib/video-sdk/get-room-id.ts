import { createVideoSDKRoom } from "@/app/videosdk/_lib/get-token";
import { getVideoSDKAuthToken } from "@/lib/auth/get-video-adk-token";

const authToken: string = getVideoSDKAuthToken();

export const getVideoSDKRoomId = async ({
  customRoomId,
}: {
  customRoomId: string;
}) => {
  const room = await checkRoomWithcustomRoomIdExists(customRoomId);

  if (room) return room;

  const newRoom = await createVideoSDKRoom({ customRoomId });

  if (!newRoom) throw new Error("Failed to create room");

  return newRoom;
};

const checkRoomWithcustomRoomIdExists = async (customRoomId: string) => {
  try {
    const res = await fetch(
      `https://api.videosdk.live/v2/rooms/validate/${customRoomId}`,
      {
        method: "GET",
        headers: {
          authorization: `${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    const { roomId }: { roomId: string } = await res.json();

    if (roomId) return roomId;
    else return null;
  } catch (error) {
    console.error("Error in checkRoomWithcustomRoomIdExists", error);
    return null;
  }
};
