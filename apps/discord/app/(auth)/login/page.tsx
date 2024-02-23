import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const Page = () => {
  return (
    <div className={cn("auth-box px-5", "h-fit")}>
      <Image
        src="https://i.postimg.cc/NGbjyF7b/logo-no-background.png"
        alt="Discord Logo"
        draggable={false}
        width={120}
        height={120}
        className="object-cover w-28 h-28 p-1 rounded-full"
      />
      <h1 className="text-4xl font-medium">Login</h1>
      <h3 className="text-white/60 mt-3 text-sm">
        Login to <strong>Aokura Connect</strong>
      </h3>
      <p className="text-white/50 mb-16 text-sm">
        We only support social logins
      </p>
      {loginProviderDetails.map((provider, index) => (
        <button
          key={index}
          className="w-full min-h-11 bg-discord_darker hover:bg-discord_blurple transition duration-75 mb-3 rounded-full flex justify-center items-center gap-x-3 p-1.5 border border-discord_blurple"
        >
          <Image
            src={provider.image}
            alt={provider.name}
            width={50}
            height={50}
            draggable={false}
            className="object-cover w-10 bg-white p-1 rounded-full"
          />
          <p className="font-medium text-1xl">
            {" "}
            Login with <strong>{provider.name}</strong>
          </p>
        </button>
      ))}
      <p className="text-white/50 tex-xs">
        Don't have an account?{" "}
        <Link href={"/register"} className="text-discord_cyan hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
};

export default Page;

const loginProviderDetails: {
  name: string;
  image: string;
  key: "google" | "twitch" | "twitter" | "github";
}[] = [
  {
    name: "Google",
    image: "https://i.postimg.cc/kXQYv98D/Google-G-logo-svg.png",
    key: "google",
  },
  {
    name: "Twitch",
    image: "https://pngimg.com/d/twitch_PNG22.png",
    key: "twitch",
  },
  {
    name: "Twitter",
    image:
      "https://i.postimg.cc/L8WhcGHV/99655e9fe24eb0a7ea38de683cedb735-removebg-preview.png",
    key: "twitter",
  },
  {
    name: "Github",
    image: "https://i.postimg.cc/B6Ms21wn/25231-removebg-preview.png",
    key: "github",
  },
];
