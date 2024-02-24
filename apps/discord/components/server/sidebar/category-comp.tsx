"use client";

import TooltipWrapper from "@/components/common/tooltip-wrapper";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ModalEnum, useModal } from "@/lib/store/modal-store";
import { cn } from "@/lib/utils";
import { TChannelDetailsDto } from "@db/dto/channel/channel-details-dto";
import {
  LucideChevronDown,
  LucideHash,
  LucidePlus,
  LucideSpeaker,
  LucideUser,
  LucideVideo,
  PencilIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

const CategoryComp = ({ data }: { data: TCategoriesWithChannels }) => {
  const { onOpen, isOpen, type, onClose } = useModal();

  const [open, setOpen] = useState<boolean>(true);

  const params = useParams<{ serverId: string; channelId: string }>();

  const handleOpen = () => {
    onOpen(ModalEnum.CREATE_CHANNEL, {
      server: { id: params!.serverId },
      category: { id: data.id, name: data.name },
    });
  };

  const isPopoverOpenOpen = isOpen && type === ModalEnum.POPOVER;
  console.log({ isPopoverOpenOpen });

  return (
    <>
      <div className="flex justify-between gap-x-2 items-center p-1">
        <div
          className="group flex items-center text-white text-opacity-60 hover:text-opacity-100 cursor-pointer p-1"
          onClick={() => setOpen(!open)}
        >
          <LucideChevronDown
            className={cn("h-3.5 w-3.5", open ? "" : "-rotate-90")}
          />
          <p className="text-sm font-medium uppercase">{data.name}</p>
        </div>

        <div className="flex gap-x-1.5">
          <Popover open={isPopoverOpenOpen} onOpenChange={() => onClose()}>
            {/* <PopoverTrigger> */}

            {/* </PopoverTrigger> */}
            <TooltipWrapper label="Edit Channel">
              <PencilIcon
                onContextMenu={() => console.log("Right Click")}
                onClick={() => onOpen(ModalEnum.POPOVER, {})}
                className="w-3.5 h-3.5 text-white text-opacity-60 hover:text-opacity-100"
              />
            </TooltipWrapper>
            <PopoverTrigger></PopoverTrigger>
            <PopoverContent>Hello jlsdnlcnsdlcnsld</PopoverContent>
          </Popover>

          <TooltipWrapper label="Create Channel">
            <LucidePlus
              onClick={handleOpen}
              className="w-4 h-5 text-white text-opacity-60 hover:text-opacity-100 mr-3"
            />
          </TooltipWrapper>
        </div>
      </div>
      {open &&
        data.channels.map((channel, index) => (
          <ChannelComp key={index} data={channel} />
        ))}
      {!open &&
        data.channels
          .filter((obj) => obj.id === params!.channelId)
          .map((channel, index) => <ChannelComp key={index} data={channel} />)}
    </>
  );
};

export default CategoryComp;

const ChannelComp = ({ data: channel }: { data: TChannelDetailsDto }) => {
  const params = useParams();
  return (
    <Link
      href={`/channel/${params!.serverId}/${channel.id}`}
      className={cn(
        "p-1.5 flex justify-between items-center gap-x-1 px-3 text-sm font-medium text-white text-opacity-65 hover:text-opacity-90 hover:bg-white/5 mx-1.5 rounded-sm",
        params!.channelId === channel.id &&
          "bg-white/10 hover:bg-white/10 text-opacity-95"
      )}
    >
      <div className="flex gap-x-1 items-center">
        {channel.type === "text" ? (
          <LucideHash className="h-4 w-4 font-semibold" />
        ) : channel.type === "voice" ? (
          <LucideSpeaker className="h-4 w-4 font-semibold" />
        ) : (
          <LucideVideo className="h-5 w-5 mr-1" />
        )}
        {channel.name}
      </div>
      <TooltipWrapper label="Invite People">
        {
          <LucideUser
            onClick={(e) => e.preventDefault()}
            className="w-4 h-5 text-white text-opacity-60 hover:text-opacity-100"
          />
        }
      </TooltipWrapper>
    </Link>
  );
};
