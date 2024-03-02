import kafka from "./client.js";
import { TMessageBodyDto } from "@repo/db/src/dto/messages/message-dto.js";

export async function startMessageConsumer() {
  console.log("Consumer is running..");
  const consumer = kafka.consumer({ groupId: "default" });
  await consumer.connect();
  await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });

  await consumer.run({
    autoCommit: true,
    autoCommitInterval: 100,
    eachMessage: async ({ message, pause }) => {
      if (!message.value) return;
      console.log(message.value.toString());
      console.log(`New Message Received: {${message.value.toString()}}`);
      try {
        const obj: TMessageBodyDto = JSON.parse(message.value.toString());
        
        console.log(obj);

        console.log("Consumer is running. Let's go!");
      } catch (err) {
        console.log("Something is wrong");
        pause();
        setTimeout(() => {
          consumer.resume([{ topic: "MESSAGES" }]);
        }, 60 * 1000);
      }
    },
  });
}