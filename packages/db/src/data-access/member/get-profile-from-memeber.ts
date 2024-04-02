import { eq } from "drizzle-orm";
import { db } from "../../db.js";
import { Member } from "../../schema.js";

export default async function getProfileFromMemberIdOperation(
  memberId: string
) {
  try {
    const member = await db.query.Member.findFirst({
      where: eq(Member.id, memberId),
      with: {
        profile: true,
      },
    });
    return {
      success: true,
      data: member,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error,
    };
  }
}
