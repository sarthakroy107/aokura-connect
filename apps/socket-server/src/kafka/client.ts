import { Kafka } from "kafkajs";

import 'dotenv/config';

const privateIp = process.env.PRIVATE_IP

console.log("Kafka privateIp: ", privateIp);

const kafka = new Kafka({
  clientId: "socket-server",
  brokers: [`${privateIp}:9092`],
});

export default kafka;