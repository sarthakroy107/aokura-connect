import { Partitioners, Producer } from "kafkajs";
import kafka from "./client.js";
import { TMessageBodyDto } from "../../../../packages/db/src/dto/messages/message-dto.js";
import { TSenderBody } from "../../../../packages/db/src/dto/messages/sender.js";

let producer: null | Producer = null;
export async function createProducer() {
  if (producer) return producer;

  const _producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
  });
  await _producer.connect();
  
  producer = _producer;

  return producer;
}

export async function produceMessage(message: TMessageBodyDto) {
  try {
    console.log("Producing server channel message");
    const producer = await createProducer();
    console.table("Producing message ");
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

export type TDirectMessage = {
  message: TMessageBodyDto & { sender: TSenderBody }
  conversationId: string
}

export async function produceDirectMessage(message: TDirectMessage) {
  try {
    const producer = await createProducer();
    // console.table("Producing direct message ");
    await producer.send({
      topic: "DIRECT_MESSAGES",
      messages: [
        { key: `message-${Date.now()}`, value: JSON.stringify(message) },
      ],
    });
    // console.log("Direct Message produced")
    // console.log({message});
    return true;
  } catch (error) {
    console.error("Error producing direct message: ", error);
    return false;
  }
}