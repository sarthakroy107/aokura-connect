"use client";

import { memo, useState } from "react";
import { useForm } from "react-hook-form";

import { transformMessageData } from "@/lib/transformations/message";
import { Trash2 } from "lucide-react";

import Image from "next/image";

import TooltipWrapper from "../common/tooltip-wrapper";
import ChatActions from "./chat-actions";
import { Textarea } from "@ui/components/ui/textarea";
import { Button } from "@ui/components/ui/button";
import { BarLoader } from "react-spinners";
import { cn } from "@ui/lib/utils";

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

    console.log(text_content);

    const [editing, setEditing] = useState(false);

    const form = useForm<{
      text_content: string | null;
      file_url: string | null;
      updated_at: string;
    }>({
      defaultValues: {
        text_content,
        file_url,
        updated_at,
      },
    });

    const onSubmit = async (values: {
      text_content: string | null;
      file_url: string | null;
      updated_at: string;
    }) => {
      setEditing(false);
      if (
        text_content !== values.text_content ||
        file_url !== values.file_url
      ) {
        form.setValue("updated_at", new Date().toISOString());
      }
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 2000);
      });
      values.updated_at = new Date().toISOString();
      console.log("submitting");
      form.reset();
    };

    const currentTextContent = form.watch("text_content");
    const lastUpdatedAt = form.watch("updated_at");

    console.table({ updated_at, lastUpdatedAt });

    return (
      <div
        className={cn(
          "w-full hover:bg-[#303236] flex gap-x-2.5 px-5 py-1.5 my-1.5",
          editing && "bg-[#303236]"
        )}
      >
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
            {!editing && (
              <div className="absolute right-0 -top-5 hidden group-hover/edit:block text-black shadow-sm shadow-black/20">
                <ChatActions data={props} setEditing={setEditing} />
              </div>
            )}
          </div>
          {editing && !form.formState.isSubmitting ? (
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="text-sm text-white text-opacity-75 mt-[2px] my-1"
            >
              <Textarea
                disabled={form.formState.isSubmitting}
                className="max-w-[690px] h-10 bg-[#202225] rounded-[3px] outline-none focus-visible:ring-offset-0 focus-visible:ring-0"
                {...form.register("text_content")}
              />
              <div className="flex pl-1 mt-0.5 text-xs text-white/50">
                <span>
                  Esc to{" "}
                  <button
                    type="button"
                    onClick={() => {
                      form.reset();
                      setEditing(false);
                    }}
                    className="text-blue-400 hover:underline"
                  >
                    cancel
                  </button>
                </span>
                &nbsp; &middot; &nbsp;
                <span>
                  Enter to{" "}
                  <button
                    type="submit"
                    className="text-blue-400 hover:underline"
                  >
                    save
                  </button>
                </span>
              </div>
            </form>
          ) : (
            <p className="text-sm text-white text-opacity-75 mt-[2px] my-1">
              {currentTextContent} &nbsp;{" "}
              {updated_at !== lastUpdatedAt && "(edited)"}
            </p>
          )}
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
