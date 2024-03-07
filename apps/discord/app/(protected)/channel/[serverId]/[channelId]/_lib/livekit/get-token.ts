export async function getLivekitToken({
  room,
  username,
}: {
  username: string;
  room: string;
}) {
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  try {
    const resp = await fetch(
      `${site}/api/get-participant-token?room=${room}&username=${username}`,
      { cache: "no-store" }
    );
    const data = await resp.json();
    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
}
