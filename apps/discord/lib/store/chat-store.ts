import { create } from "zustand";
import { shallow }  from "zustand/shallow";
import { messageBodyDto } from "@/lib/transformations/message";

type TChatReply = {
  inReply: true | null;
  messageId: string | null;
  senderName: string | null;
  mediaContent: boolean | null;
  fobiddenState: null;
  isTextEditing: boolean;
  setReply: (data: ReturnType<typeof messageBodyDto>) => void;
  setEditing: (data: ReturnType<typeof messageBodyDto>) => void;
  eraceReplyData: () => void;
};

export const useChatActions = create<TChatReply>((set) => ({
  inReply: null,
  text_message: null,
  messageId: null,
  senderName: null,
  mediaContent: null,
  fobiddenState: null,
  isTextEditing: false,
  setReply: (data) =>
    set((state) => ({
      ...state,
      inReply: true,
      messageId: data.id,
      senderName: data.sender.name,
      mediaContent: data.file_url ? true : false,
    })),
  setEditing: (data) => ({
    messageId: data.id,
    isTextEditing: true,
  }),
  eraceReplyData: () =>
    set((state) => ({
      ...state,
      inReply: null,
      messageId: null,
      senderName: null,
      mediaContent: null,
    })),
}));