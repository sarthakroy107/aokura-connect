"use client";

import { messageBodyDto } from "@db/dto/messages/message-dto";
import { forwardRef } from "react";

const ChatTextComponent = forwardRef(
  (
    {
      data,
      setIsEditing,
      formIsSubmitting,
    }: {
      data: ReturnType<typeof messageBodyDto>;
      setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
      formIsSubmitting: boolean;
    },
    ref
  ) => {
    return (
      <p className="text-sm text-white text-opacity-75 mt-[2px]">
        {data.content}
      </p>
    );
  }
);

export default ChatTextComponent;
