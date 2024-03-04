import kafka from "./client.js";
import { TMessageBodyDto } from "../../../../packages/db/src/dto/messages/message-dto.js";
import { insertMessage } from "../../../../packages/db/src/data-access/messages/create-message.js";

import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
neonConfig.webSocketConstructor = ws; 


export async function startMessageConsumer() {
  const consumer = kafka.consumer({ groupId: "default" });
  await consumer.connect();
  await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });

  await consumer.run({
    autoCommit: true,
    autoCommitInterval: 100,
    eachMessage: async ({ message, pause }) => {
      if (!message.value) return;
      try {

        console.log("Parsing message...");
        const obj: TMessageBodyDto = await JSON.parse(message.value.toString());

        console.log("Inserting message into database...");
        await insertMessage(obj);

        console.log("Message inserted into database");
      } catch (err) {
        console.log("Something is wrong");
        pause();
        setTimeout(() => {
          consumer.resume([{ topic: "MESSAGES" }]);
        }, 10 * 1000);
      }
    },
  });
}