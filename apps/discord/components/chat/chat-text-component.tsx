"use client";

import { transformMessageData } from "@/lib/transformations/message";
import { forwardRef } from "react";

const ChatTextComponent = forwardRef(
  (
    {
      data,
      setIsEditing,
      formIsSubmitting,
    }: {
      data: ReturnType<typeof transformMessageData>;
      setIsEditing: React.Dispatch<
        React.SetStateAction<boolean>
      >;
      formIsSubmitting: boolean;
    },
    ref 
  ) => {
    return (
      <p className="text-sm text-white text-opacity-75 mt-[2px]">
        {data.text_content}
      </p>
    );
  }
);

export default ChatTextComponent;
