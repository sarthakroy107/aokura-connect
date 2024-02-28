"use server";

import { checkToken } from "@db/data-access/auth-js/verify-email";
import { createServer } from "@db/data-access/server/create-server";
import { getAnimeGirlImage } from "@db/fun/get-anime-girl-image";

export const verifyEmail = async (token: string | undefined) => {
  if (!token)
    return {
      status: 400,
      success: false,
      message: "No token provided",
    };

  const checkTokenRes = await checkToken(token);

  if (checkTokenRes.status !== 200) {
    console.log("Token not verified");
    return {
      status: checkTokenRes.status,
      success: false,
      message: checkTokenRes.message,
    };
  }

  if (!checkTokenRes.profile) {
    console.log("Profile not found but token verified");
    return {
      status: 500,
      success: false,
      message: "Profile not found but token verified",
    };
  }

  //*As email varification is successfull,so no need to check for valid profile or not

  const newServer = await createServer({
    serverName: `${checkTokenRes.profile?.name}'s Server`,
    creatorProfileId: checkTokenRes.profile?.id,
    serverAvatar: getAnimeGirlImage(),
    serverDescription: `This is the server of ${checkTokenRes.profile?.name}`,
  });

  if (newServer.status !== 200) {
    console.log("Server not created");
    return {
      status: newServer.status,
      success: false,
      message: newServer.message,
    };
  }

  if (!newServer.data?.serverId || !newServer.data?.channelId) {
    console.log("Server not created but status is 200")
    return {
      status: 500,
      success: false,
      message: "Server not created but status is 200",
    };
  }

  console.log(`channel/${newServer.data?.serverId}/${newServer.data?.channelId}`);
  return {
    status: 200 as const,
    success: true as const,
    message: "Server created successfully",
    redirectLink: `channel/${newServer.data?.serverId}/${newServer.data?.channelId}`,
  };
};
