import { Hash, LucideVideo, Speaker } from "lucide-react";
import ChatLiveBadge from "./chat-live-badge";

const ChannelNavbar = ({
  id,
  name,
  type,
}: {
  id: string;
  name: string;
  type: TDBChannel["channel_type"];
}) => {
  return (
    <div
      className="w-full sticky top-0 h-11 bg-discord shadow-sm shadow-black/30 flex 
      justify-between items-center px-3 text-white text-opacity-40 gap-x-1"
    >
      <div className="flex items-center gap-x-1">
        {type === "text" ? (
          <Hash className="h-5 w-5 font-semibold" />
        ) : type === "voice" ? (
          <Speaker />
        ) : (
          <LucideVideo />
        )}{" "}
        <p className="font-semibold">{name}</p>
      </div>
      <ChatLiveBadge />
    </div>
  );
};

export default ChannelNavbar;
