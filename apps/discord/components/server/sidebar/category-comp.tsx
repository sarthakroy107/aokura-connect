"use client";

import TooltipWrapper from "@/components/common/tooltip-wrapper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
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
  Settings,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

const CategoryComp = ({
  categoryData,
}: {
  categoryData: TCategoriesWithChannels;
}) => {
  const { onOpen, openModalWithOptions } = useModal();
  const [open, setOpen] = useState<boolean>(true);

  const params = useParams<{ serverId: string; channelId: string }>();

  const handleOpen = () => {
    onOpen(ModalEnum.CREATE_CHANNEL, {
      server: { id: params!.serverId },
      category: { id: categoryData.id, name: categoryData.name },
    });
  };

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
          <p className="text-sm font-medium uppercase">{categoryData.name}</p>
        </div>

        <div className="flex gap-x-1.5">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <TooltipWrapper label="Edit Channel">
                <PencilIcon className="w-3.5 h-3.5 text-white text-opacity-60 hover:text-opacity-100 mx-0.5" />
              </TooltipWrapper>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-[3px]">
              <DropdownMenuItem
                onClick={() =>
                  openModalWithOptions({
                    type: "modify-category",
                    data: {
                      categoryId: categoryData.id,
                      categoryName: categoryData.name,
                    },
                  })
                }
                className="px-2"
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  openModalWithOptions({
                    type: "delete-category",
                    data: {
                      categoryId: categoryData.id,
                      categoryName: categoryData.name,
                    },
                  })
                }
                className="px-2 focus:bg-rose-600 text-rose-500 focus:text-white"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <TooltipWrapper label="Create Channel">
            <LucidePlus
              onClick={handleOpen}
              className="w-4 h-5 text-white text-opacity-60 hover:text-opacity-100 mr-3"
            />
          </TooltipWrapper>
        </div>
      </div>
      {open && (
        <div className="space-y-0.5">
          {categoryData.channels.map((channel, index) => (
            <ChannelComp
              key={index}
              data={channel}
              serverId={categoryData.server_id}
            />
          ))}
        </div>
      )}
      {!open &&
        categoryData.channels
          .filter((obj) => obj.id === params!.channelId)
          .map((channel, index) => (
            <ChannelComp
              key={index}
              data={channel}
              serverId={categoryData.server_id}
            />
          ))}
    </>
  );
};

export default CategoryComp;

const ChannelComp = ({
  data: channel,
  serverId,
}: {
  data: TChannelDetailsDto;
  serverId: string;
}) => {
  const params = useParams();
  const { openModalWithOptions } = useModal();
  return (
    <Link
      href={`/channel/${params!.serverId}/${channel.id}`}
      className={cn(
        "group p-1.5 flex justify-between items-center gap-x-1 px-3 text-sm font-medium text-white text-opacity-65 hover:text-opacity-90 hover:bg-white/5 mx-1.5 rounded-sm",
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
        <p className="">
          {channel.name.length > 14
            ? channel.name.slice(0, 14) + "..."
            : channel.name}
        </p>
      </div>
      <div className="flex items-center gap-1.5 invisible group-hover:visible">
        <TooltipWrapper label="Edit Channel">
          <Settings
            onClick={() => {
              openModalWithOptions({
                type: "modify-channel",
                data: {
                  serverId: params!.serverId as string,
                  channelId: channel.id,
                  channelName: channel.name,
                  channelType: channel.type,
                  isPrivate: channel.isPrivate,
                  isBlocked: channel.isBlocked,
                },
              });
            }}
            className="w-3.5 h-3.5 text-white text-opacity-60 hover:text-opacity-100"
          />
        </TooltipWrapper>
        <TooltipWrapper label="Invite People">
          <LucideUser
            onClick={() =>
              openModalWithOptions({
                type: "create-inviation-link",
                data: {
                  channelId: channel.id,
                  serverId: params!.serverId as string,
                },
              })
            }
            className="w-4 h-5 text-white text-opacity-60 hover:text-opacity-100"
          />
        </TooltipWrapper>
      </div>
    </Link>
  );
};
