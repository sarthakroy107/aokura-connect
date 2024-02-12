'use server';
import { db } from "@db/db";
import { Member, Profile, Server } from "@db/schema";
import { eq } from "drizzle-orm";

type TChageImage = {
  type: 'server' | 'profile' | 'member'
  avatar_url: string
  id: string
}
export const changeImage = async (data: TChageImage) => {
  const { type, avatar_url, id } = data
  try {

    if(type === 'server') {
      await db.update(Server).set({ avatar:  avatar_url }).where(eq(Server.id, id));
      return true;
    }
    else if(type === 'profile') {
      await db.update(Profile).set({ avatar:  avatar_url }).where(eq(Profile.id, id));
      return true;
    }
    else if(type === 'member') {
      await db.update(Member).set({ server_avatar:  avatar_url }).where(eq(Member.id, id));
      return true;
    }
    else {
      throw new Error('Invalid type')
    }

  } catch (error) {
    console.log(error)
    return false;
  }
}


type TChangeName = {
  type: 'server' | 'profile' | 'member'
  name: string
  id: string
}

export const changeName = async (data: TChangeName) => {
  const { type, name, id } = data
  try {

    if(type === 'server') {
      await db.update(Server).set({ name }).where(eq(Server.id, id));
      return true;
    }
    else if(type === 'profile') {
      await db.update(Profile).set({ name }).where(eq(Profile.id, id));
      return true;
    }
    else if(type === 'member') {
      await db.update(Member).set({ nickname: name }).where(eq(Member.id, id));
      return true;
    }
    else {
      throw new Error('Invalid type')
    }

  } catch (error) {
    console.log(error)
    return false;
  }
}