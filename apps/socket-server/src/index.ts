import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { decrypt, verifyToken } from "./verify-token.js";
import { TInsertMessage } from "../../../packages/db/src/data-access/messages/create-message.js";
import { produceMessage } from "./kafka/producer.js";
import { startMessageConsumer } from "./kafka/consumer.js";
import { formateNewChatMessage } from "./messages/format-new-chat-message.js"
import { messageSchema } from "./messages/message-schema.js";


const httpServer = createServer();

const socketServer = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
  },
});

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

  io.on("event:message", async (data: TInsertMessage) => {
    console.log(data.token);
    const result = messageSchema.safeParse(data);

    if (result.success) {
      try {
        console.log(data.token)
        await decrypt(data.token);
        const message = result.data;
        const formattedMessage = formateNewChatMessage(message);
        const res = await produceMessage(formattedMessage);
        if (res) {
          io.nsp
            .to(`channel:${message.channelId}`)
            .emit("event:broadcast-message", formattedMessage);
        }
      } catch (error) {
        console.log("Error: ", error);
        return;
      }
    } else {
      console.log("Invalid message: ", result.error);
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//admin();
startMessageConsumer();