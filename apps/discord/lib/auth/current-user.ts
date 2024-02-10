'use server';
import { auth } from "@clerk/nextjs"
import { db } from '@/lib/index'
import { ConsoleLogWriter, eq } from "drizzle-orm";
import { Member, Profile } from "../schema";
import { currentUser } from "@clerk/nextjs";

export const currentProfile = async () => {

    const { userId } = auth();
    if(!userId) return null;

    const profile = await db.select().from(Profile).where(eq(Profile.clerk_user_id, userId));
    if(profile && profile[0]) return profile[0];

    const data = await currentUser();

    console.log('Current user');
    
    console.log(data?.username);

    if(!data) return null;
    console.log(data)
    
    const newProfile = await db.insert(Profile).values({ clerk_user_id: userId!, username: data?.username!, name: data?.firstName + ' '+ data?.lastName, email: data?.emailAddresses[0].emailAddress, phone: data?.phoneNumbers[0].phoneNumber, }).returning();

    if(newProfile && newProfile[0]) return newProfile[0];

    return null;
}