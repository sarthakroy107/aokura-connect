import { eq } from "drizzle-orm";
import { db } from "../../db";
import { Profile } from "../../schema";

type TDeleteProfile = {
  key: string;
  keyType: "email" | "username" | "id"
}
export const deleteProfile = async (data: TDeleteProfile) => {
  
}