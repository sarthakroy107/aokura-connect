import { createServer } from '@db/data-access/server/create-server'
type TCreateNewServer = {
  creatorProfileId: string,
  serverName: string,
  serverAvatar?: string,
  serverDescription?: string,
}
export const createNewServer = async (data: TCreateNewServer) => {
  const newServer = await createServer(data);
}