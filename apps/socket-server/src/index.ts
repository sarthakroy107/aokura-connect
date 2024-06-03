import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { verifyToken } from "./verify-token.js";
import { TInsertMessage } from "../../../packages/db/src/data-access/messages/create-message.js";
import { produceDirectMessage, produceMessage } from "./kafka/producer.js";
import { startMessageConsumer } from "./kafka/consumer.js";
import { formateNewChatMessage } from "./messages/format-new-chat-message.js";
import { messageSchema } from "./messages/message-schema.js";
import {
  TChangeChannelStatus,
  chnageChannelStatus,
} from "./channel/block-channel.js";
import Redis from "ioredis";

const pub = new Redis({
  host: "13.202.130.171", // Your EC2 instance public IP
  port: 6379, // Default Redis port
  password: "mai-sakuta",
});

pub.on("connect", () => {
  console.log("Connected to Redis from publisher");
});

const sub = new Redis({
  host: "13.202.130.171", // Your EC2 instance public IP
  port: 6379, // Default Redis port
  password: "mai-sakuta",
});

sub.on("connect", () => {
  console.log("Connected to Redis from subscriber");
});

sub.subscribe("MESSAGES");

const httpServer = createServer();

const socketServer = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://aokura-connect.vercel.app"],
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
  },
});

socketServer.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  console.log("Socket token: ", token);
  if (await verifyToken(token)) {
    next();
  } else {
    next(new Error("Invalid token"));
  }
});

const PORT = 6700;

socketServer.on("connection", (io: Socket) => {
  console.log("Socket connected: ", io.id);

  io.on("message", (data) => {
    console.log("Message: ", data);
    io.emit("message", data);
  });

  io.on("disconnect", () => {
    console.log("Socket disconnected: ", io.id);
  });

  io.on("event:join", (data) => {
    io.join(`channel:${data.channel_id}`);
  });

  io.on("event:chat-input-join", (data) => {
    io.join(`channel-input:${data.channel_id}`);
  });

  io.on("event:leave", (data) => {
    io.leave(`channel:${data.channel_id}`);
  });

  io.on("event:send-message", async (data: TInsertMessage) => {
    const result = messageSchema.safeParse(data);
    if (result.success) {
      try {
        const message = result.data;
        const formattedMessage = formateNewChatMessage(message);
        await pub.publish("MESSAGES", JSON.stringify(formattedMessage));
        const res =
          message.type === "server-message"
            ? await produceMessage(formattedMessage)
            : await produceDirectMessage({
                message: formattedMessage,
                conversationId: result.data.channelId,
              });
        // if (res) {
        //   io.nsp
        //     .to(`channel:${message.channelId}`)
        //     .emit("event:broadcast-message", formattedMessage);
        // }
      } catch (error) {
        console.log("Error: ", error);
        return;
      }
    } else {
      console.log("Invalid message: ", result.error);
      console.error(
        `Invalid request: ${result.error.errors.map((e) => `${e.path}: ${e.message}`).join(" | ")}`
      );
    }
  });

  io.on("event:change-channel-status", async (data: TChangeChannelStatus) => {
    console.log("Channel status changing: ", data);
    const res = await chnageChannelStatus({
      newState: data.newState,
      channelId: data.channelId,
    });
    console.log(
      "Channel status changed, emitting new event ",
      res,
      data.newState
    );
    io.nsp
      .to(`channel-input:${data.channelId}`)
      .emit("event:channel-status-changed", data.newState);
  });
});

sub.on("message", (channel, message) => {
  console.log("FROM CHANNEL:", channel);
  console.log("New message: ", message);
  const parsedMessage: ReturnType<typeof formateNewChatMessage> =
    JSON.parse(message);
  socketServer // Changed io.nsp.to to .to
    .to(`channel:${parsedMessage.channelId}`)
    .emit("event:broadcast-message", parsedMessage);
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

startMessageConsumer();
// startDirectMessageConsumer()
