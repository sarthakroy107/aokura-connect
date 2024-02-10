'use client';

import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { LucideSearch } from "lucide-react"
import React, { useEffect, useState } from "react";

interface IServerSearchProps {
  data: {
    label: string;
    type: "channel" | "member";
    data: {
      id: string;
      name: string;
      icon: React.ReactNode;
    }[]
  }[]
}

const ServerSearch = (data: IServerSearchProps) => {

  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, []);

  return (
    <>
      <button onClick={() => setOpen(true)} className="flex justify-between w-[205px] p-1 px-1.5 rounded-[3px] shadow-sm shadow-black/10 text-sm bg-discord m-1.5">
        <div className="flex gap-x-2 items-center">
          <LucideSearch size="14" />
          <p>Search</p>
        </div>
        <kbd className="bg-discord_darkest text-white/20 text-xs p-[2px] rounded-[2px]">⌘+k</kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="bg-discord">
          <CommandInput value={search} onValueChange={setSearch} className="" placeholder="Search member and profile in server" />
          <CommandList className="">
            <CommandEmpty>No results found</CommandEmpty>
            {
              data.data.map((obj, index) => (
                <div key={index}>
                  <CommandGroup heading={obj.label}>
                    {
                      obj.data.map((item, index) => (
                        <CommandItem className="" key={index}>{item.name}</CommandItem>
                      ))
                    }
                  </CommandGroup>
                  <CommandSeparator className="bg-white/60" />
                </div>
              ))
            }
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}

export default ServerSearch