import kafka from "./client.js";
import { TMessageBodyDto } from "../../../../packages/db/src/dto/messages/message-dto.js";
import { insertMessage } from "../../../../packages/db/src/data-access/messages/create-message.js";
import createDMOperation from "../../../../packages/db/src/data-access/direct-message/create-dm.js";
import { checkIsMemberOfChannelAndGetMemberDetails } from "../../../../packages/db/src/data-access/member/check-is-member-of-channel.js";

import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { TDirectMessage } from "./producer.js";
import { TSenderBody } from "@repo/db/src/dto/messages/sender.js";
neonConfig.webSocketConstructor = ws;

export async function startMessageConsumer() {
  const consumer = kafka.consumer({ groupId: "default" });
  await consumer.connect();
  await consumer.subscribe({
    topics: ["MESSAGES", "DIRECT_MESSAGES"],
    fromBeginning: true,
  });

  await consumer.run({
    autoCommit: true,
    autoCommitInterval: 100,
    eachMessage: async ({ message, pause, topic }) => {
      console.log("In message consumer");
      if (!message.value) return;
      try {
        if (topic === "MESSAGES") {
          const obj: TMessageBodyDto & { sender: TSenderBody } =
            await JSON.parse(message.value.toString());
          const res = await checkIsMemberOfChannelAndGetMemberDetails({
            channelId: obj.channelId,
            profileId: obj.sender.id,
          });

          if (!res || !res.hasJoinedChannel || !res.memberDetails) return;
          obj.sender.id = res.memberDetails.id;
          await insertMessage(obj);
          console.log("Message inserted into database");
        } else if (topic === "DIRECT_MESSAGES") {
          console.log("In direct message consumer");
          const obj: TDirectMessage = await JSON.parse(
            message.value.toString()
          );
          console.log(obj);
          await createDMOperation({
            conversationId: obj.conversationId,
            senderProfileId: obj.message.sender?.id,
            textContent: obj.message.content,
            files: obj.message.attachments,
            inReplyTo: obj.message.inReplyTo
              ? obj.message.inReplyTo.id
              : undefined,
          });
          //console.log("Direct Message inserted into database");
          //console.log(res.data);
        }
      } catch (err) {
        console.log("Something is wrong");
        pause();
        setTimeout(() => {
          consumer.resume([{ topic: "MESSAGES" }]);
        }, 5 * 1000);
      }
    },
  });
}
