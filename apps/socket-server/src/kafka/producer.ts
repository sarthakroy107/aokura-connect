import { Producer } from "kafkajs";
import kafka from "./client.js";
import { TInsertMessage } from "@repo/db/src/data-access/messages/create-message.js";
import { TMessageBodyDto } from "@repo/db/src/dto/messages/message-dto.js";

let producer: null | Producer = null;
export async function createProducer() {
  if (producer) return producer;

  const _producer = kafka.producer();
  await _producer.connect();
  producer = _producer;

  return producer;
}

export async function produceMessage(message: TMessageBodyDto) {
  try {
    const producer = await createProducer();
    await producer.send({
      topic: "MESSAGES",
      messages: [
        { key: `message-${Date.now()}`, value: JSON.stringify(message) },
      ],
    });
    return true;
  } catch (error) {
    console.error("Error producing message: ", error);
    return false;
  }
}
