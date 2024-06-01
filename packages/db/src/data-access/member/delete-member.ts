import { eq } from "drizzle-orm";
import { db } from "../../db.js";
import { Member } from "../../schema.js";

export async function deleteMember({ memberId }: { memberId: string }) {
  try {
    console.log("Deleting member with id: ", memberId);
    await db.delete(Member).where(eq(Member.id, memberId));
    return {
      status: 200,
      message: "Deleted successfully",
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Internal Server Error",
      success: false,
    };
  }
} // Path: packages/db/src/data-access/member/get-member.ts
