"use client";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@ui/components/ui/button";
import { Calendar, TUISelectSingleEventHandler } from "@ui/components/ui/calendar";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/components/ui/popover";
import { FieldError } from "react-hook-form";
import { forwardRef } from "react";

interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  label?: string;
  required: boolean;
  error?: FieldError;
  value: Date;
  onChange: TUISelectSingleEventHandler
};

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ label, required, error, ...props }, ref) => {
    return (
      <FormItem className="flex flex-col">
        <FormLabel>{label}</FormLabel>
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full bg-discord_darkest hover:bg-white/05 pl-3 text-left font-normal rounded-[3px]",
                  !props.value && "text-muted-foreground"
                )}
              >
                {props.value ? (
                  format(props.value, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={props.value}
              onSelect={props.onChange}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <FormMessage />
      </FormItem>
    );
  }
);
export default DateInput;
