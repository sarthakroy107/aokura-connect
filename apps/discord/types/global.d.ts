import { Socket } from "net";
import { Server as NetServer } from "http";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { MemberType, MessageType, ProfileType } from "@db/schema";

declare global {
  interface ICustomChannel {
    name: string;
    id: string;
    creator_member_id: string;
    category_id: string;
    channel_type: "video" | "text" | "voice";
    is_private: boolean;
  }

  interface ICategoriesWithChannels {
    server_id: string;
    name: string;
    id: string;
    creator_member_id: string;
    description: string | null;
    channels: ICustomChannel[];
  }

  type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
      server: NetServer & {
        io: SocketIOServer;
      };
    };
  };

  type TChatMessageData = MessageType & {
    sender: MemberType & {
      profile: ProfileType;
    }
  }
  
}