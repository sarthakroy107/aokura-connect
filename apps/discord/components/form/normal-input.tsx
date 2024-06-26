import React, { forwardRef } from "react";
import { Label } from "@ui/components/ui/label";
import { Input } from "@ui/components/ui/input";
import { cn } from "@ui/lib/utils";
import { FieldError } from "react-hook-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  inputClassName?: string;
  containerClassName?: string;
  labelClassName?: string;
  description?: string;
  error?: FieldError;
  disabled?: boolean;
  children?: React.ReactNode;
}

const NormalInput = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      containerClassName = "",
      labelClassName = "",
      inputClassName = "",
      description,
      required = false,
      error,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn(containerClassName, "my-1")}>
        <Label className="">
          {label}
          {required ? <sup className="text-rose-500 px-0.5">*</sup> : ""}
        </Label>
        <Input
          ref={ref}
          className={cn(
            inputClassName,
            "bg-[#202225] rounded-[3px] outline-none focus-visible:ring-offset-0 focus-visible:ring-0 mt-1.5"
          )}
          disabled={disabled}
          placeholder={description}
          {...props}
        />
        {children}
        <p className="text-red-500 text-sm h-2">{error?.message}</p>
      </div>
    );
  }
);

NormalInput.displayName = "NormalInput";

export default NormalInput;
