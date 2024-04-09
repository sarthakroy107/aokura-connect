import Image from "next/image";
import Link from "next/link";
import getPendingDMs from "../_actions/get-pending-messages";

export default async function DirectMessasgeSidebar() {
  const pendingConversations = await getPendingDMs();
  return (
    <div className="min-w-[220px] max-w-[220px] h-screen overflow-auto bg-[rgb(40,43,48)] text-white space-y-1 p-1.5">
      <p className="text-xs p-1 font-medium text-white/60">DIRECT MESSAGES</p>
      <DirectMessageProfileComp
        id="1"
        name="Sarthak Roy"
        avatar="https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/6c463ed7-b290-4c55-593d-baf4ed4fa900/width=1200/6c463ed7-b290-4c55-593d-baf4ed4fa900.jpeg"
        status={true}
      />
      <DirectMessageProfileComp
        id="2"
        name="John Doe"
        avatar="https://www.1999.co.jp/itbig98/10984618a_m.jpg"
        status={true}
      />
      <DirectMessageProfileComp
        id="3"
        name="John Doe"
        avatar="https://prompthero.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaEpJaWsxWkRGa1lUUXhPUzAyWWpjNUxUUXdZMkl0T1dRMFlpMHpPR0ptTlRFNE16VTRZV0VHT2daRlZBPT0iLCJleHAiOm51bGwsInB1ciI6ImJsb2JfaWQifX0=--c9f30a4cf605b137492e18c20137e62952171f60/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBPZ2wzWldKd09oUnlaWE5wZW1WZmRHOWZiR2x0YVhSYkIya0NBQWhwQWdBSU9ncHpZWFpsY25zSk9oTnpkV0p6WVcxd2JHVmZiVzlrWlVraUIyOXVCam9HUlZRNkNuTjBjbWx3VkRvT2FXNTBaWEpzWVdObFZEb01jWFZoYkdsMGVXbGYiLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--beed8ed72637ca3712935f65de3d18ae25f2cc85/586510.jpeg"
        status={true}
      />
      <DirectMessageProfileComp
        id="4"
        name="Megumin"
        avatar="https://imgs.search.brave.com/JvxSPwA9g9X3HeAp5jKU9PI_G9s0fBMukkFY-ApRMPE/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMzLmFscGhhY29k/ZXJzLmNvbS8xMzEv/MTMxOTQ3MC5qcGVn"
        status={true}
      />
      <DirectMessageProfileComp
        id="5"
        name="Rem"
        avatar="https://www.hdwallpapers.in/download/blue_short_hair_eyes_rem_re_zero_uniform_dress_4k_5k_hd_anime_girl-3840x2160.jpg"
        status={true}
      />
      <p className="text-xs p-1 font-medium text-white/60 mt-2">
        PENDING MESSAGES
      </p>
      {pendingConversations.data &&
        pendingConversations.data.map((conversation) => (
          <DirectMessageProfileComp
            id={conversation.conversationId}
            name={conversation.senderName}
            avatar={conversation.senderAvatar || ""}
            status={true}
          />
        ))}
    </div>
  );
}

function DirectMessageProfileComp({
  id,
  avatar,
  name,
  status,
}: {
  id: string;
  name: string;
  avatar: string;
  status: boolean;
}) {
  return (
    <Link
      href={`/channel/me/${id}`}
      className="w-full flex p-1 px-1.5 hover:bg-white/10 rounded-sm cursor-pointer space-x-1.5 items-center"
    >
      <Image
        src={avatar}
        alt="avatar"
        width={40}
        height={40}
        className="rounded-full object-cover h-8 w-8"
      />
      <p>{name}</p>
    </Link>
  );
}