import kafka from "./client.js";
export async function startMessageConsumer() {
    const consumer = kafka.consumer({ groupId: "default" });
    await consumer.connect();
    await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });
    await consumer.run({
        autoCommit: true,
        autoCommitInterval: 100,
        eachMessage: async ({ message, pause }) => {
            if (!message.value)
                return;
            try {
                console.log("Parsing message...");
                const obj = await JSON.parse(message.value.toString());
                console.log("Inserting message into database...");
                //await insertMessage(obj);
                console.log("Message inserted into database");
            }
            catch (err) {
                console.log("Something is wrong");
                pause();
                setTimeout(() => {
                    consumer.resume([{ topic: "MESSAGES" }]);
                }, 10 * 1000);
            }
        },
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3VtZXIuanMiLCJzb3VyY2VSb290IjoiL2hvbWUvc2FydGhhay9Db2RpbmcvcGVyc29uYWwtcHJvamVjdHMvZGlzY29yZC10dXJiby1vZy9hcHBzL3NvY2tldC1zZXJ2ZXIvIiwic291cmNlcyI6WyJzcmMva2Fma2EvY29uc3VtZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE1BQU0sYUFBYSxDQUFDO0FBSWhDLE1BQU0sQ0FBQyxLQUFLLFVBQVUsb0JBQW9CO0lBQ3hDLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztJQUN4RCxNQUFNLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUN6QixNQUFNLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBRXJFLE1BQU0sUUFBUSxDQUFDLEdBQUcsQ0FBQztRQUNqQixVQUFVLEVBQUUsSUFBSTtRQUNoQixrQkFBa0IsRUFBRSxHQUFHO1FBQ3ZCLFdBQVcsRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUN4QyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUs7Z0JBQUUsT0FBTztZQUMzQixJQUFJLENBQUM7Z0JBRUgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO2dCQUNsQyxNQUFNLEdBQUcsR0FBb0IsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztnQkFFeEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO2dCQUNsRCwyQkFBMkI7Z0JBRTNCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztZQUNoRCxDQUFDO1lBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztnQkFDYixPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7Z0JBQ2xDLEtBQUssRUFBRSxDQUFDO2dCQUNSLFVBQVUsQ0FBQyxHQUFHLEVBQUU7b0JBQ2QsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDM0MsQ0FBQyxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUNoQixDQUFDO1FBQ0gsQ0FBQztLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMifQ==