import { createServer } from "http";
import { Server, Socket } from "socket.io";

const httpServer = createServer();
const socketServer = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
  },
})

const PORT = 6700

socketServer.on("connection", (io: Socket) => {
  console.log("Socket connected: ", io.id);

  io.on("message", (data) => {
    console.log("Message: ", data)
    socketServer.emit("message", data);
  });

  io.on("disconnect", () => {
    console.log("Socket disconnected: ", io.id);
  });

  io.on("event:message", (data) => {
    console.log("Event message: ", data);
    
  });

});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
