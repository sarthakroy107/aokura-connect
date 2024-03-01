import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { decrypt, verifyToken } from "./verify-token.js";
import { TInsertMessage } from '@repo/db/src/data-access/messages/create-message.js'
export type TMessage = TInsertMessage & { token: string }
import z, { ZodType } from "zod";
import { produceMessage } from "./kafka/producer.js";
import { startMessageConsumer } from "./kafka/consumer.js";
import { admin } from "./kafka/admin.js";

const messageSchema: ZodType<TMessage> = z.object({
  messageData: z.object({
    textMessage: z.string().nullable().optional(),
    fileUrl: z.string().nullable().optional(),
    inReplyTo: z.string().nullable().optional(),
    memberId: z.string(),
  }),

  channelId: z.string(),
  token: z.string(),
});

const httpServer = createServer();

const socketServer = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
  },
});

startMessageConsumer()

socketServer.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
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

  io.on("event:leave", (data) => {
    io.leave(`channel:${data.channel_id}`);
  });

  io.on("event:message", async (data: TMessage) => {
    const payload = await decrypt(data.token);
    console.log(payload)
    const result = messageSchema.safeParse(data);
    if (result.success) {
      const message = result.data;
      const res = await produceMessage(message);
      if (res) {
        io.nsp
          .to(`channel:${message.channelId}`)
          .emit("event:broadcast-message", message);
        console.log("Message produced: ", message);
      }
    } else {
      console.log("Invalid message: ", result.error);
    }
  });

});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});