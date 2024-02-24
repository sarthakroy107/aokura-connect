'use client';
import { TMemberWithChannelIds } from "@db/dto/member/member-with-channel-ids";
import { create } from "zustand"


export enum ModalEnum {
    CREATE_SERVER       = "create-server",
    CREATE_CATEGORY     = "create-category",
    CREATE_CHANNEL      = "create-channel",
    UPLOAD_FILE         = "upload-file",
    EDIT_SERVER         = "edit-server",
    EDIT_SERVER_PROFILE = "edit-server-profile",
    JOIN_SERVER         = "join-server",
    POPOVER             = "popover",
    DELETE_CHAT_IMAGE   = "delete-chat-image",
    MODIFY_SERVER       = "modify-server",
}

interface IModalDataType {
    server?: TDBServer,
    category?: TDBCategory,
    channel?: TDBChannel,
    api_url?: string;
    profile?: TDBProfile,
    member?: TMemberWithChannelIds
    query?: Record<string, any>;
}

interface IModalStore {
    type: ModalEnum | null,
    data: IModalDataType,
    isOpen: boolean,
    file_url?: string | null | undefined,
    onOpen: (type: ModalEnum, data: any) => void,
    onClose: () => void,
    setFileUrl: (url: string | null) => void,
    setData: (data: IModalDataType) => void,
}

export const useModal = create<IModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    file_url: null,
    onOpen: (type, data = {}) => set({ type, data, isOpen: true }),
    onClose: () => set({ type: null, isOpen: false }),
    setFileUrl: (url) => set({ file_url: url }),
    setData: (data) => set({ data }),
}))
