"use server";
import checkConversationExistsOperation from "@db/data-access/conversation/check-conversation-exists";
import createConversationOperation from "@db/data-access/conversation/create-conversation";

export default async function checkConversationExistsAction({
  profileId1,
  profileId2,
}: {
  profileId1: string;
  profileId2: string;
}) {
  //*Make sure profileId1 starts the conversation
  try {
    const hasConversation = await checkConversationExistsOperation({
      profileId1,
      profileId2,
    });

    if(hasConversation.data) {
      return {
        success: true,
        
      }
    }

  } catch (error) {
    console.error(error);
    return {
      success: false,
      status: 500,
      error,
    };
  }
}
