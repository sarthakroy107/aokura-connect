"use client";

import { TAPILeaveServerResponse } from "@/app/api/member/route";
import { useModal } from "@/lib/store/modal-store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@ui/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const LeaveServerModal = () => {
  const { options, onClose, isOpen } = useModal();

  const isModalOpen = isOpen && options.type === "leave-server";
  const router = useRouter();

  const leaveServer = async () => {
    if (options.type !== "leave-server") return;
    console.log("leave server");
    const res = await fetch(`/api/member?server_id=${options.data.serverId}`, {
      method: "DELETE",
    });
    const data: TAPILeaveServerResponse = await res.json();
    if (res.status === 200) {
      onClose();
      router.push("/channel/me");
      router.refresh();
    } else toast.error(data.message || "Failed to leave server");
  };

  return (
    <AlertDialog open={isModalOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-discord border-0 rounded-[3px] p-0">
        <AlertDialogTitle className="text-xl mx-7 mt-7">
          Leave Server
        </AlertDialogTitle>
        <AlertDialogDescription className="mx-7 mb-5">
          Are you sure
        </AlertDialogDescription>
        <AlertDialogFooter className="bg-discord_darker px-7 p-3 rounded-b-[3px]">
          <AlertDialogCancel className="bg-discord_darker hover:bg-discord_darker border-0 shadow-none hover:underline">
            CANCEL
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={leaveServer}
            className="bg-red-500 hover:bg-red-500/85 my-2 mx-5"
          >
            LEAVE
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LeaveServerModal;
