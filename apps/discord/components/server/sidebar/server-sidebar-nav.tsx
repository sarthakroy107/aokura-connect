"use client";

import { useState, memo, useEffect } from "react";
import { useParams } from "next/navigation";

import { TMemberWithChannelIds } from "@db/dto/member/member-with-channel-ids";
import { ModalEnum, useModal } from "@/lib/store/modal-store";

import {
  LucideChevronDown,
  LucideDoorOpen,
  LucideFolderPlus,
  LucidePencil,
  LucideUser,
  LucideX,
} from "lucide-react";
import { Separator } from "@ui/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@ui/components/ui/dropdown-menu";

const ServersidebarNavbar = memo(
  ({
    label,
    className,
    member,
  }: {
    label: string;
    className: "";
    member: TMemberWithChannelIds;
  }) => {
    const [open, setOpen] = useState<boolean>(false);
    const params = useParams<{ serverId: string }>();
    const { onOpen, setData, openModalWithOptions } = useModal();

    useEffect(() => {
      setData({ member });
    }, [member]);

    return (
      <DropdownMenu onOpenChange={() => setOpen(!open)}>
        <DropdownMenuTrigger
          className={cn(
            "w-full h-11 flex justify-between items-center shadow-sm shadow-black/30 px-3 mb-2 font-medium"
          )}
        >
          {label}
          {!open ? (
            <LucideChevronDown className="h-5 w-5" />
          ) : (
            <LucideX className="h-4 w-4" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={cn(
            "w-[220px] bg-[#09090b] p-2 py-3 rounded-[4px]",
            className
          )}
        >
          <DropdownMenuItem className="flex justify-between items-center hover:bg-[#7289da] text-primary hover:text-primary-foreground font-medium p-2 py-1 rounded-[2px] cursor-pointer">
            <p>Invite People</p>
            <LucideUser className="w-4 h-5 text-opacity-60 hover:text-opacity-100" />
          </DropdownMenuItem>
          <Separator className="my-1" />
          <DropdownMenuItem
            onClick={() => onOpen(ModalEnum.MODIFY_SERVER, {})}
            className="flex justify-between items-center hover:bg-[#7289da] my-1 text-opacity-60 hover:text-opacity-100 hover:text-primary-foreground p-2 py-1 rounded-[2px] cursor-pointer"
          >
            <p>Edit Server</p>
            <LucidePencil className="w-4 h-5 text-opacity-60 hover:text-opacity-100" />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              onOpen(ModalEnum.CREATE_CATEGORY, {
                server: { id: params!.serverId },
              })
            }
            className="flex justify-between items-center hover:bg-[#7289da] my-1 text-opacity-60 hover:text-opacity-100 hover:text-primary-foreground p-2 py-1 rounded-[2px] cursor-pointer"
          >
            <p>Create Category</p>
            <LucideFolderPlus className="w-4 h-5 text-opacity-60 hover:text-opacity-100" />
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onOpen(ModalEnum.EDIT_SERVER_PROFILE, {})}
            className="flex justify-between items-center hover:bg-[#7289da] my-1 text-opacity-60 hover:text-opacity-100 hover:text-primary-foreground p-2 py-1 rounded-[2px] cursor-pointer"
          >
            <p>Edit Server Profile</p>
            <LucideDoorOpen className="w-4 h-5 text-opacity-60 hover:text-opacity-100" />
          </DropdownMenuItem>
          <Separator className="my-1" />
          <DropdownMenuItem
            onClick={() =>
              openModalWithOptions({
                type: "leave-server",
                data: { serverId: member.server_id },
              })
            }
            className="flex w-full justify-between items-center text-rose-500 focus:bg-red-500 hover:text-opacity-100 hover:text-white p-2 py-1 rounded-[2px] cursor-pointer"
          >
            <p>Leave Server</p>
            <LucideFolderPlus className="w-4 h-5 text-opacity-60 hover:text-opacity-100" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);

ServersidebarNavbar.displayName = "ServersidebarNavbar";

export default ServersidebarNavbar;
