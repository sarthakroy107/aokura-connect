"use client";
import { cn } from '@/lib/utils'
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import TooltipWrapper from '../common/tooltip-wrapper';

interface IServerIcon {
  id: string;
  name: string;
  avatar: string | null;
}

const SidebarServerIcon = ({ server }: { server: IServerIcon }) => {
  const params = useParams();
  const router = useRouter();
  return (
    <TooltipWrapper label={server.name} side='right'>
      <div onClick={() => router.push(`/channel/${server.id}`)} className='group flex items-center my-2 gap-x-2 w-full h-11 cursor-pointer'>
        <div className={cn('bg-white rounded-r-sm w-1 transition-all duration-200', params!.serverId !== server.id && 'h-3 group-hover:h-10', params!.serverId === server.id && 'h-10',)} />
        <div className={cn('w-11 h-11 overflow-hidden transition-all', params!.serverId !== server.id && "rounded-[24px] hover:rounded-[16px]", params!.serverId === server.id && 'rounded-[16px]')}>
          <Image className='h-11 w-11 object-cover' src={server.avatar ? server.avatar : 'https://hololist.net/wp-content/uploads/2022/08/himemiya-rie-portrait-66.jpg'}
            alt={server.name} width={100} height={100} draggable={false} />
        </div>
      </div>
    </TooltipWrapper>
  )
}

export default SidebarServerIcon