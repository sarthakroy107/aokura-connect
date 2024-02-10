
import { db } from "@/lib";
import { Channel, Member, Message } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {

  if (req.method !== "POST") return res.status(405).end()

  try {
    const { content, file_url }: { content: string, file_url: string } = JSON.parse(req.body);
    console.log(req.body)
    console.log({content, file_url})
    const { c_id, s_m_id } = req.query;

    console.log("Channel")
    const channel = await db.query.Channel.findMany({
      where: eq(Channel.id, c_id as string),
      with: {
        members: {
          where: eq(Member.id, s_m_id as string)
        }
      }
    })

    if (!channel) return res.status(404).end()
    console.log(channel[0])
  
    //@ts-ignore
    const newMessage = await db.insert(Message).values({ sender_member_id: s_m_id, channel_id: c_id, content, file_url }).execute()
    res.socket.server.emit(`channel:${c_id}:message`, { content, file_url })
    console.log("Socket emitted on:: " + `channel:${c_id}:message`)
    return res.status(200).json('Hello')
  } catch (error) {
    console.log(error);
    return res.status(500).end()
  }
}