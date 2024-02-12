'use client';

import TooltipWrapper from '@/components/common/tooltip-wrapper'
import { ModalEnum, useModal } from '@/lib/store/modal-store';
import { cn } from '@ui/lib/utils';
import { LucideCompass, LucidePlus } from 'lucide-react'
import React from 'react'

const JoinServer = () => {
  const { onOpen } = useModal();
  return (
    <TooltipWrapper label='Join server' side='right'>
      <div
        onClick={() => onOpen(ModalEnum.JOIN_SERVER, { })}
        className={cn(
          "group w-11 h-11 flex justify-center items-center bg-white/10 rounded-[24px] hover:rounded-[16px] transition-all ml-2.5 mt-1.5 hover:bg-discord_green"
        )}
      >
        <LucideCompass
          className="text-discord_green group-hover:text-white delay-100"
          size={20}
        />
      </div>
    </TooltipWrapper>
  )
}

export default JoinServer