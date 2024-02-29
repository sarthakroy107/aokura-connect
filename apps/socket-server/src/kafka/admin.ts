import kafka from "./client";

export async function admin() {
  const admin = kafka.admin();
  console.log("Admin connecting...");
  admin.connect();
  console.log("Adming Connection Success...");

  console.log("Creating Topic MESSAGES");
  await admin.createTopics({
    topics: [
      {
        topic: "MESSAGES",
        numPartitions: 1,
      },
    ],
  });

  console.log("Topic Created Success");

  console.log("Disconnecting Admin..");
  await admin.disconnect();
}

admin().catch(console.error);