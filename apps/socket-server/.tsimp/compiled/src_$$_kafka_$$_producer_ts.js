import kafka from "./client.js";
let producer = null;
export async function createProducer() {
    if (producer)
        return producer;
    const _producer = kafka.producer();
    await _producer.connect();
    producer = _producer;
    return producer;
}
export async function produceMessage(message) {
    try {
        const producer = await createProducer();
        console.table("Producing message ");
        await producer.send({
            topic: "MESSAGES",
            messages: [
                { key: `message-${Date.now()}`, value: JSON.stringify(message) },
            ],
        });
        return true;
    }
    catch (error) {
        console.error("Error producing message: ", error);
        return false;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjZXIuanMiLCJzb3VyY2VSb290IjoiL2hvbWUvc2FydGhhay9Db2RpbmcvcGVyc29uYWwtcHJvamVjdHMvZGlzY29yZC10dXJiby1vZy9hcHBzL3NvY2tldC1zZXJ2ZXIvIiwic291cmNlcyI6WyJzcmMva2Fma2EvcHJvZHVjZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxLQUFLLE1BQU0sYUFBYSxDQUFDO0FBR2hDLElBQUksUUFBUSxHQUFvQixJQUFJLENBQUM7QUFDckMsTUFBTSxDQUFDLEtBQUssVUFBVSxjQUFjO0lBQ2xDLElBQUksUUFBUTtRQUFFLE9BQU8sUUFBUSxDQUFDO0lBRTlCLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNuQyxNQUFNLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUMxQixRQUFRLEdBQUcsU0FBUyxDQUFDO0lBRXJCLE9BQU8sUUFBUSxDQUFDO0FBQ2xCLENBQUM7QUFFRCxNQUFNLENBQUMsS0FBSyxVQUFVLGNBQWMsQ0FBQyxPQUF3QjtJQUMzRCxJQUFJLENBQUM7UUFDSCxNQUFNLFFBQVEsR0FBRyxNQUFNLGNBQWMsRUFBRSxDQUFDO1FBQ3hDLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUNwQyxNQUFNLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDbEIsS0FBSyxFQUFFLFVBQVU7WUFDakIsUUFBUSxFQUFFO2dCQUNSLEVBQUUsR0FBRyxFQUFFLFdBQVcsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUU7YUFDakU7U0FDRixDQUFDLENBQUM7UUFDSCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQywyQkFBMkIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNsRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7QUFDSCxDQUFDIn0=