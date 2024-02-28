import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { decrypt, verifyToken } from "./verify-token";

type TMessage = {
  data: {
    textMsg?: string | undefined;
    fileUrl?: string | undefined;
    inReplyTo?: string | undefined;
  };
  channelId: string;
  token: string;
};

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
  if(await verifyToken(token)) {
    next();
  }
  else {
    next(new Error("Invalid token"));
  }
});

const PORT = 6700;


socketServer.on("connection", (io: Socket) => {
  console.log("Socket connected: ", io.id);

  io.on("message", (data) => {
    console.log("Message: ", data);
    socketServer.emit("message", data);
  });

  io.on("disconnect", () => {
    console.log("Socket disconnected: ", io.id);
  });

  io.on("event:join", (data) => {
    console.log("Event join: ", data);
    console.log("Channel id: ", data.channel_id);
    io.join(data.channel_id);
  });

  io.on("event:leave", (data) => {
    console.log("Event leave: ", data.channel_id);
    io.leave(data.channel_id);
  });

  io.on("event:message", async (data) => {

    const token = await decrypt(data.token);
    console.log("Token: ", token);
    console.log("Event message: ", data);
    io.to(data.channelId).emit("event:broadcast-message", data);
  });
}); 

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
