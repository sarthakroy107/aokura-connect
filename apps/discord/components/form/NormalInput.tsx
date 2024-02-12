import React, { forwardRef } from "react";
import { Label } from "@ui/components/ui/label";
import { Input } from "@ui/components/ui/input";
import { cn } from "@ui/lib/utils";
import { FieldError } from "react-hook-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  className?: string;
  description?: string;
  error?: FieldError;
}

const NormalInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className = "", description, required = false, error, ...props }, ref) => {
    return (
      <div>
        <Label className="">
          {label}
          {required ? "*" : ""}
        </Label>
        <Input
          ref={ref}
          className={cn(
            className,
            "bg-[#202225] rounded-[3px] outline-none focus-visible:ring-offset-0 focus-visible:ring-0 mt-1.5"
          )}
          placeholder={description}
          {...props}
        />
        <p className="text-red-500 text-sm h-2">{error?.message}</p>
      </div>
    );
  }
);

NormalInput.displayName = 'NormalInput';

export default NormalInput;