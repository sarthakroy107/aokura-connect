import { Socket } from "net";
import { Server as NetServer } from "http";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { TProfile, TServer, TMember, TCategory, TChannel, TMemberToChannel, TMessage } from "@db/schema";
import { transformMessageData } from "@/lib/transformations/message";
c

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

  type TDBProfile = TProfile
  type TDBServer = TServer
  type TDBMember = TMember
  type TDBCategory = TCategory
  type TDBChannel = TChannel
  type TDBMemberToChannel = TMemberToChannel
  type TDBMessage = TMessage

  type TChatMessageData = TDBMessage & {
    sender: TDBMember & {
      profile: TDBProfile;
    }
  }
  type TTransformedMessage = ReturnType<typeof transformMessageData>
}