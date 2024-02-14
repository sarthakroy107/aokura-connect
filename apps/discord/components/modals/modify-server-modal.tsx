"use client";

import { ModalEnum, useModal } from "@/lib/store/modal-store";
import { Dialog, DialogContent, DialogHeader } from "@ui/components/ui/dialog";
import { PuffLoader } from 'react-spinners'

import useCurrentServer from "@/components/hooks/use-current-member";
import ServerDetailsForm from "@/components/form/server-details-form";

const ModifyServerModal = () => {
  const { isOpen, onClose, type } = useModal();

  const { isServerDataFetching, refetchServerData, server } =
    useCurrentServer();

  //*IF SERVER DATA REFTCHING IS NEEDED
  // useEffect(() => {
  //   if (isOpen && !isServerDataFetching) {
  //     refetchServerData();
  //   }
  // }, [isOpen]);

  const isModalOpen = isOpen && type === ModalEnum.MODIFY_SERVER;

  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      <DialogContent className="bg-discord p-0 min-h-16">
        <DialogHeader className="text-2xl font-medium mt-5">
          Modify Server
        </DialogHeader>
        {
          isServerDataFetching ? (
            <div className="w-full flex justify-center items-center h-56">
              <PuffLoader color="#5865F2" />
            </div>
          ) : !server ? <div>Error</div> : (
            <ServerDetailsForm data={server} newServer={false} />
          )
        }
      </DialogContent>
    </Dialog>
  );
};

export default ModifyServerModal;
