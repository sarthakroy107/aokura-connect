"use client";

import { cn } from "@/lib/utils";
import { LucidePlus } from "lucide-react";
import TooltipWrapper from "../../components/common/tooltip-wrapper";
import { ModalEnum, useModal } from "@/lib/store/modal-store";

const CreateServerIcon = ({ profile }: { profile: TDBProfile }) => {
  const { onOpen } = useModal();
  return (
    <TooltipWrapper label="Create Server" side="right">
      <div
        onClick={() => onOpen(ModalEnum.CREATE_SERVER, { profile: profile })}
        className={cn(
          "group w-11 h-11 flex justify-center items-center bg-white/10 rounded-[24px] hover:rounded-[16px] transition-all ml-2.5 mt-1 hover:bg-discord_green"
        )}
      >
        <LucidePlus
          className="text-discord_green group-hover:text-white delay-100"
          size={20}
        />
      </div>
    </TooltipWrapper>
  );
};

export default CreateServerIcon;
