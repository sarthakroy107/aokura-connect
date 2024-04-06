import { create } from "zustand";
import { shallow }  from "zustand/shallow";
import { TMessageBodyDto } from "@db/dto/messages/message-dto";

type TChatReply = {
  inReply: true | null;
  fobiddenState: null;
  isTextEditing: boolean;
  replingToMessageData: TMessageBodyDto | null
  setReply: (data: TMessageBodyDto) => void;
  setEditing: (data: TMessageBodyDto) => void;
  eraceReplyData: () => void;
};

export const useChatActions = create<TChatReply>((set) => ({
  inReply: null,
  fobiddenState: null,
  isTextEditing: false,
  replingToMessageData: null,
  setReply: (data) =>
    set((state) => ({
      ...state,
      inReply: true,
      messageId: data.id,
      senderName: data.sender?.name || "",
      mediaContent: data.attachments ? true : false,
      replingToMessageData: data,
    })),
  setEditing: (data) => ({
    messageId: data.id,
    isTextEditing: true,
  }),
  eraceReplyData: () =>
    set((state) => ({
      ...state,
      inReply: null,
      replingToMessageData: null,
    })),
}));