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
import {
  DropdownMenuLabel,
  DropdownMenuShortcut,
} from "@ui/components/ui/dropdown-menu";
import { Separator } from "@ui/components/ui/separator";

export default function ThemeToggle() {
  const { setTheme, themes, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "group w-11 h-11 flex justify-center items-center bg-white/10 rounded-[24px] hover:rounded-[16px] transition-all ml-2.5 mt-1 text-discord_green hover:text-white hover:bg-discord_green"
        )}
      >
        <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
        <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>

        {/* </TooltipWrapper> */}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="right"
        className="bg-black rounded-[3px]"
      >
        <DropdownMenuLabel>Themes</DropdownMenuLabel>
        <Separator className="mb-1" />
        {themes.map((themeOpt) => (
          <DropdownMenuItem
            key={themeOpt}
            onClick={() => setTheme(themeOpt)}
            defaultChecked={theme === themeOpt}
            className="transition-none rounded-[3px]"
          >
            {themeOpt}
            <DropdownMenuShortcut>
              <div
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  themeOpt === "default"
                    ? "bg-discord_blurple"
                    : themeOpt === "orange"
                      ? "bg-[#ea580c]"
                      : themeOpt === "green"
                        ? "bg-[#22c55e]"
                        : themeOpt === "yellow"
                          ? "bg-[#facc15]"
                          : themeOpt === "blue"
                            ? "bg-[#3b82f6]"
                            : themeOpt === "violet"
                              ? "bg-[#6d28d9]"
                              : themeOpt === "zinc"
                                ? "bg-[#fafafa]"
                                : null
                )}
              />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
