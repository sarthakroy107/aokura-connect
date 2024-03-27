export default function Page({
  params: { conversationId },
}: {
  params: { conversationId: string };
}) {
  return <div>{conversationId}</div>;
}
