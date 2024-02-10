'use server';
import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server;
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    });
    io.on('connection', (socket) => {
      console.log('New connection established')
      socket.on('hii', ({ message }) => {
        console.log(message)
        console.log('Received hii, Sending hello to client')
        socket.emit('hello', 'Hello from server');
      })
    })
    res.socket.server.io = io;
  }

  res.end();
}

export default ioHandler;