export const getVideoSDKAuthToken = () => {
  const authToken: string = process.env.NEXT_PUBLIC_VIDEOSDK_AUTH_TOKEN!;
  if (!authToken) {
    throw new Error("Auth token is not available in getVideoSDKAuthToken");
  }
  return authToken;
};
