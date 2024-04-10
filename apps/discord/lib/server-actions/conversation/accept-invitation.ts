"use server";
import { acceptConversation } from "@db/data-access/conversation/aceept";
import { revalidatePath } from "next/cache";

export default async function acceptedInvitation(coversationId: string) {
  await acceptConversation(coversationId);
  revalidatePath(`/channel/me/${coversationId}`);
}
