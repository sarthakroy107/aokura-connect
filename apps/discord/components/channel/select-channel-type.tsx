import { cn } from "@ui/lib/utils";
import { LucideIcon } from "lucide-react";

export default function ChannelTypeButton({
  label,
  selected,
  hanedleClick,
  LucideIconComponent,
  isLoading,
  disabled = false,
}: {
  label: string;
  hanedleClick: () => void;
  selected: boolean;
  LucideIconComponent: LucideIcon;
  isLoading: boolean;
  disabled: boolean;
}) {
  return (
    <button
      disabled={isLoading || disabled}
      onClick={hanedleClick}
      type="button"
      className={cn(
        "border hover:border-primary/60 disabled:opacity-75 py-2.5 rounded-[3px] disabled:border-primary/30  flex font-medium text-xl items-center space-x-1 px-3 bg-discord_darkest w-full disabled:bg-discord_darker",
        selected &&
          "border-primary hover:border-primary disabled:border-primary/40"
      )}
    >
      <div className="p-0.5 border border-primary rounded-full mr-2">
        <div className={cn("p-1 rounded-full", selected && "bg-primary")} />
      </div>
      <LucideIconComponent width={22} /> &nbsp;
      {label}
    </button>
  );
}
