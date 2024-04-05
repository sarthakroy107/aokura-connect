type TSenderBody = {
  id: string;
  role: "admin" | "moderator" | "guest" | null;
  name: string;
  avatar: string;
  isBanned: boolean | null;
  isMuted: boolean | null;
  isKicked: boolean | null;
  isLeft: boolean | null;
  joinedOn: string;
};

type TGenericMessageBody = {
  id: string;
  content: string;
  attachments: string[];
  isDeleted: boolean;
  channelId: string;
  sender: TSenderBody | null;
  inReplyTo: {
    id: string;
    content: string;
    attachments: string[];
    sender: TSenderBody | null;
    createdAt: string;
    lastEditedOn: string;
  } | null;
  createdAt: string;
  lastEditedOn: string;
};

export type { TSenderBody, TGenericMessageBody };
