import { transformMessageData } from "@/lib/transformations/message";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import React, { memo } from "react";
import TooltipWrapper from "../common/tooltip-wrapper";

const MessageComponent = memo(
  (props: ReturnType<typeof transformMessageData>) => {
    const {
      text_content,
      file_url,
      sender: { name, avatar },
      is_deleted,
      created_at,
      updated_at,
    } = props;
    return (
      <div className="w-full hover:bg-[#303236] flex gap-x-2.5 px-5 py-1.5 my-1.5">
        <div className="mt-[2px]">
          <Image
            src={
              avatar
                ? avatar
                : "https://i.ibb.co/GQ8CTsZ/1aa7e647b894e219e42cc079d8e54e18.jpg"
            }
            alt={name}
            width={64}
            height={64}
            draggable={false}
            className="rounded-full object-cover h-10 w-10"
          />
        </div>
        <div className="group/edit w-[95%] relative">
          <div className="w-full justify-between flex gap-x-3">
            <div className="flex gap-x-2">
              <p className="text-sm font-medium hover:underline cursor-pointer">
                {name}
              </p>
              <p className="text-xs text-white text-opacity-40 mt-0.5">
                {created_at}
              </p>
            </div>
            <div className="w-24 h-5 bg-white absolute right-0 -top-3 hidden group-hover/edit:block"></div>
          </div>
          <p className="text-sm text-white text-opacity-75 mt-[2px]">
            {text_content}
          </p>
          {file_url && (
            <div className="group/delete w-fit mt-1 relative">
              <div className="hidden group-hover/delete:flex justify-center items-center bg-discord hover:bg-red-500 absolute right-1.5 top-1.5 cursor-pointer rounded-sm">
                <TooltipWrapper label="Delete" side="top">
                  <Trash2 className="m-1" />
                </TooltipWrapper>
              </div>
              <Image
                width={900}
                height={750}
                src={file_url}
                alt="upload"
                draggable={false}
                className="h-56 w-fit object-cover rounded-sm"
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default MessageComponent;
