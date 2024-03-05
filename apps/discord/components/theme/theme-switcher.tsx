"use client";

import * as React from "react";

import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoonIcon, SunIcon } from "lucide-react";
import TooltipWrapper from "../common/tooltip-wrapper";
import { cn } from "@ui/lib/utils";

export default function ThemeToggle() {
  const { setTheme, themes } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* <TooltipWrapper label="Themes" side="right"> */}
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "group w-11 h-11 flex justify-center items-center bg-white/10 rounded-[24px] hover:rounded-[16px] transition-all ml-2.5 mt-1 text-discord_green hover:text-white hover:bg-discord_green"
          )}
        >
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        {/* </TooltipWrapper> */}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="right">
        {themes.map((theme) => (
          <DropdownMenuItem key={theme} onClick={() => setTheme(theme)}>
            {theme}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
