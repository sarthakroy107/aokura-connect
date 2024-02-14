"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ModalEnum, useModal } from "@/lib/store/modal-store";
import { cn } from "@/lib/utils";
import {
  LucideChevronDown,
  LucideDoorOpen,
  LucideFolderPlus,
  LucidePencil,
  LucideUser,
  LucideX,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState, memo, useEffect } from "react";

const ServersidebarNavbar = memo(
  ({
    label,
    className,
    member,
  }: {
    label: string;
    className: "";
    member: TDBMember;
  }) => {
    const [open, setOpen] = useState<boolean>(false);
    const params = useParams<{ serverId: string }>();
    const { onOpen, setData } = useModal();

    useEffect(() => {
      setData({ member });
    }, [member]);

    return (
      <Popover onOpenChange={() => setOpen(!open)}>
        <PopoverTrigger
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
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "w-[220px] bg-[#09090b] p-2 py-3 rounded-[4px]",
            className
          )}
        >
          <div className="flex justify-between items-center hover:bg-[#7289da] text-[#7289da] hover:text-white font-medium p-2 py-1 rounded-[2px] cursor-pointer">
            <p>Invite People</p>
            <LucideUser className="w-4 h-5 text-opacity-60 hover:text-opacity-100" />
          </div>
          <Separator className="my-1" />
          <div
            onClick={() => onOpen(ModalEnum.MODIFY_SERVER, {})}
            className="flex justify-between items-center hover:bg-[#7289da] my-1 text-opacity-60 hover:text-opacity-100 hover:text-white p-2 py-1 rounded-[2px] cursor-pointer"
          >
            <p>Edit Server</p>
            <LucidePencil className="w-4 h-5 text-opacity-60 hover:text-opacity-100" />
          </div>
          <div
            onClick={() =>
              onOpen(ModalEnum.CREATE_CATEGORY, {
                server: { id: params!.serverId },
              })
            }
            className="flex justify-between items-center hover:bg-[#7289da] my-1 text-opacity-60 hover:text-opacity-100 hover:text-white p-2 py-1 rounded-[2px] cursor-pointer"
          >
            <p>Create Category</p>
            <LucideFolderPlus className="w-4 h-5 text-opacity-60 hover:text-opacity-100" />
          </div>

          <Separator className="my-1" />

          <button
            onClick={() => onOpen(ModalEnum.EDIT_SERVER_PROFILE, {})}
            className="flex w-full justify-between items-center text-rose-500 hover:bg-rose-600 hover:text-opacity-100 hover:text-white p-2 py-1 rounded-[2px] cursor-pointer"
          >
            <p>Edit Server Profile</p>
            <LucideDoorOpen className="w-4 h-5 text-opacity-60 hover:text-opacity-100" />
          </button>
        </PopoverContent>
      </Popover>
    );
  }
);

ServersidebarNavbar.displayName = "ServersidebarNavbar";

export default ServersidebarNavbar;
