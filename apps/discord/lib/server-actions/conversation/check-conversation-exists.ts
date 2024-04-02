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
    let conversationId: string;
    const hasConversation = await checkConversationExistsOperation({
      profileId1,
      profileId2,
    });
    if(!hasConversation.success ||  hasConversation.status !== 200 || !hasConversation.data) {
      const newConversation = await createConversationOperation({ profileId1, profileId2 });
      if(!newConversation.success || !newConversation.data) {
        throw new Error("Failed to create conversation");
      }
      conversationId = newConversation.data.id;
    }
    else conversationId = hasConversation.data.id;

    

  } catch (error) {
    console.error(error);
    return {
      success: false,
      status: 500,
      error,
    };
  }
}
