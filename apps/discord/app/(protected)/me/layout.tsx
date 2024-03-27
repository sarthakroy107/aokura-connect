import DirectMessasgeSidebar from "./direct-message-sidebar";

export default function DirectMessageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <DirectMessasgeSidebar />
      {children}
    </div>
  );
}
