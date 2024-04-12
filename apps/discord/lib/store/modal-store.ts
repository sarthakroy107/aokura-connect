"use client";
import { TMemberWithChannelIdsDTO } from "@db/dto/member/member-with-channel-ids";
import { create } from "zustand";

export enum ModalEnum {
  CREATE_SERVER = "create-server",
  CREATE_CATEGORY = "create-category",
  CREATE_CHANNEL = "create-channel",
  UPLOAD_FILE = "upload-file",
  EDIT_SERVER = "edit-server",
  EDIT_SERVER_PROFILE = "edit-server-profile",
  JOIN_SERVER = "join-server",
  POPOVER = "popover",
  DELETE_CHAT_IMAGE = "delete-chat-image",
  MODIFY_SERVER = "modify-server",
  MODIFY_CATEGORY = "modify-category",
}

type TModalDataType = {
  server?: TDBServer;
  category?: TDBCategory;
  channel?: TDBChannel;
  api_url?: string;
  profile?: TDBProfile;
  member?: TMemberWithChannelIdsDTO;
  query?: Record<string, any>;
};

export type TEditCategoryData = {
  categoryId: string;
  categoryName: string;
};

export type TDeleteCategoryData = {
  categoryId: string;
  categoryName: string;
};

type TOptionsData =
  | {
      type: "modify-category";
      data: TEditCategoryData;
    }
  | {
      type: "modify-category";
      data: {
        categoryId: string;
        categoryName: string;
      };
    }
  | {
      type: null;
      data: null;
    }
  | {
      type: "delete-category";
      data: TDeleteCategoryData;
    }
  | {
      type: "create-inviation-link";
      data: {
        serverId: string;
        channelId: string | null;
      };
    }
  | {
      type: "leave-server";
      data: {
        serverId: string;
      };
    }
  | {
      type: "modify-channel";
      data: {
        channelId: string;
        channelName: string;
        channelType: "text" | "voice" | "video";
        isPrivate: boolean;
        isBlocked: boolean;
        serverId: string;
      };
    };

//Need category.id in create-channel-modal.tsx
//Need data.profile?.id in create-server-modal.tsx
//Need data.category?.id and data.category?.name in create-channel-modal.tsx

type TModalStore = {
  options: TOptionsData;
  type: ModalEnum | null;
  data: TModalDataType;
  isOpen: boolean;
  file_url?: string | null | undefined;
  onOpen: (type: ModalEnum, data: any) => void;
  onClose: () => void;
  setFileUrl: (url: string | null) => void;
  setData: (data: TModalDataType) => void;
  openModalWithOptions: (options: TOptionsData) => void;
};

export const useModal = create<TModalStore>((set) => ({
  options: { type: null, data: null },
  type: null,
  data: {},
  isOpen: false,
  file_url: null,
  onOpen: (type, data = {}) => set({ type, data, isOpen: true }),
  onClose: () =>
    set({ type: null, isOpen: false, options: { type: null, data: null } }),
  setFileUrl: (url) => set({ file_url: url }),
  setData: (data) => set({ data }),
  openModalWithOptions: (options) => set({ isOpen: true, options }),
}));
