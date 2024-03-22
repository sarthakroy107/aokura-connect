import { signOut } from "@/auth";
import TooltipWrapper from "@/components/common/tooltip-wrapper";
import { cn } from "@ui/lib/utils";
import { LucideLogOut } from "lucide-react";
import { redirect } from "next/navigation";

export default function SignOutButton() {
  return (
    <TooltipWrapper label="Log out" side="right">
      <form
        action={async () => {
          "use server";
          await signOut();
          redirect("/login");
        }}
      >
        <button
          type="submit"
          className={cn(
            "group w-11 h-11 flex justify-center items-center bg-white/10 rounded-[24px] hover:rounded-[16px] transition-all ml-2.5 mt-1 hover:bg-discord_green"
          )}
        >
          <LucideLogOut
            className="text-discord_green group-hover:text-white delay-100"
            size={20}
          />
        </button>
      </form>
    </TooltipWrapper>
  );
}
