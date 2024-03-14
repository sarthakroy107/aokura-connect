"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { changeImage } from "@/lib/server-actions/common/actions";
import { useState } from "react";
import { useCurrentProfile } from "@/components/hooks/use-current-profile";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

import Image from "next/image";
import ClipLoader from "react-spinners/ClipLoader";
import useCurrentServer from "../hooks/use-current-member";

type TDisplayImageChange = {
  currentImage: string;
  endpoint: "profileImage" | "serverImage";
  id: string;
  type: "server" | "profile" | "member";
};


const DisplayImageChange = ({
  currentImage,
  endpoint,
  id,
  type,
}: TDisplayImageChange) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { serverId } = useParams<{ serverId: string }>();

  const { refetchCurrentProfileData} = useCurrentProfile();
  const { refetchServerData } = useCurrentServer(serverId);

  return (
    <>
      {editing ? (
        <UploadDropzone
          endpoint={endpoint}
          onUploadBegin={() => {
            setIsUploading(true);
            setEditing(false);
          }}
          onClientUploadComplete={async (res) => {
            try {
              await changeImage({ id, avatar_url: res[0]!.url, type });
              toast.success("Image changed successfully");
              if (refetchCurrentProfileData && refetchServerData) {
                refetchCurrentProfileData();
                refetchServerData();
              }
            } catch (error) {
              console.log(error);
              toast.error("Something went wrong in db");
            } finally {
              setIsUploading(false);
            }
          }}
          onUploadError={() => {
            toast.error("Something went wrong in upload");
            setIsUploading(false);
          }}
        />
      ) : (
        <button
          onClick={() => {
            isUploading ? null : setEditing(true);
          }}
          className="relative"
        >
          <Image
            width={200}
            height={200}
            src={currentImage}
            alt="current image"
            className="rounded-full object-cover w-28 h-28 z-0"
          />
          <div
            className="group w-28 h-28 border border-white flex items-center rounded-full 
            justify-center hover:bg-slate-400/20 z-10 absolute top-0 left-0 transition-all"
          >
            {isUploading ? (
              <ClipLoader color="#ffffff" />
            ) : (
              <Pencil className="w-11 h-11 group-hover:visible invisible transition-all" />
            )}
          </div>
        </button>
      )}
    </>
  );
};

export default DisplayImageChange;
