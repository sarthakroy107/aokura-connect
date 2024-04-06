import { Socket } from "net";
import { Server as NetServer } from "http";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import {
  TProfile,
  TServer,
  TMember,
  TCategory,
  TChannel,
  TMemberToChannel,
  TMessage,
  TEmailActivationTokenTable,
} from "@db/schema";
import { messageBodyDto } from "@/lib/transformations/message";
import { TCategoryWithChannelsDetailsDto } from "@db/dto/categories/categories-detils-dto";
import { TMessageBodyDto } from "@db/dto/messages/message-dto";

declare global {
  interface ICustomChannel {
    name: string;
    id: string;
    creator_member_id: string;
    category_id: string;
    channel_type: "video" | "text" | "voice";
    is_private: boolean;
  }

  type TCategoriesWithChannels = TCategoryWithChannelsDetailsDto;

  type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
      server: NetServer & {
        io: SocketIOServer;
      };
    };
  };

  type TDBProfile = TProfile;
  type TDBServer = TServer;
  type TDBMember = TMember;
  type TDBCategory = TCategory;
  type TDBChannel = TChannel;
  type TDBMemberToChannel = TMemberToChannel;
  type TDBMessage = TMessage;
  type TDBEmailActivationTokenTable = TEmailActivationTokenTable;

  type TChatMessageData = TDBMessage & {
    sender: TDBMember & {
      profile: TDBProfile;
    };
  };
  type TTransformedMessage = TMessageBodyDto;
  type TResponse = {
    status: number;
    success: boolean;
    message: string;
  };
}
