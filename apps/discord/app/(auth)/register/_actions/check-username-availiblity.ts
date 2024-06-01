"use server";
import { isUsernameAvailable } from "@db/data-access/user/is-username-available";

export const checkUsernameAvailibility = async (username: string) => {
  try {
    
    const res = await isUsernameAvailable(username);
    if (res) {
      return {
        available: true,
        username,
        message: "Username is available",
      };
    } else if (res === null)
      return {
        available: false,
        username,
        message: "Error in DB",
      };
    else
      return {
        available: false,
        username,
        message: "Username is not available",
      };
  } catch (error) {
    console.error(error);
    return {
      available: false,
      username,
      message: "An error occurred while checking username availability",
    };
  }
};
