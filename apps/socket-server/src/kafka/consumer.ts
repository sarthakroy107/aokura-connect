import kafka from "./client.js";

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
      console.log(`New Message Received: {${message.value.toString()}}`);
      try {
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