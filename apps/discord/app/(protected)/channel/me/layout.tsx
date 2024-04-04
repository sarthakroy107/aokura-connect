import DirectMessasgeSidebar from "./direct-message-sidebar";

export default function DirectMessageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-full">
      <DirectMessasgeSidebar />
      <div className="w-full h-full">
        {children}
      </div>
    </div>
  );
}
