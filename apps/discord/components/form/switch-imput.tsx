"use client";
import { Label } from "@ui/components/ui/label";
import { Switch } from "@ui/components/ui/switch";
import { cn } from "@ui/lib/utils";
import { forwardRef } from "react";

interface SwitchInputProps {
  value: boolean | undefined;
  onChange: (checked: boolean) => void;
  className?: string;
  label: string;
}

const SwitchInput = forwardRef<HTMLButtonElement, SwitchInputProps>(
  ({ value, label, className, onChange }, ref) => {
    return (
      <div className={cn("flex items-center space-x-2 mt-1.5", className)}>
        <Switch
          ref={ref}
          checked={value}
          onCheckedChange={onChange}
          className=" bg-primary text-primary data-[state=checked]:bg-primary"
          color="#686bff"
        />
        <Label>{label}</Label>
      </div>
    );
  }
);

export default SwitchInput;