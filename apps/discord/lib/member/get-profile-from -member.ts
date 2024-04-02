'use server';
import getProfileFromMemberIdOperation from '@db/data-access/member/get-profile-from-memeber';

export default async function getProfileFromMemberIdAction(memberId: string) {
  const res = await getProfileFromMemberIdOperation(memberId);
  console.log({res});
  if (!res.success || !res.data?.profile) {
    return {
      success: false,
      status: 404,
      error: 'Failed to get profile from member',
    }
  } else {
    return {
      success: true,
      status: 200,
      data: res.data.profile,
    }
  }

}