import CreateServerModal from "@/components/modals/create-server-modal";
import CreateCategoryModal from "@/components/modals/create-category-modal";
import CreateChannelModal from "@/components/modals/create-channel-modal";
import UploadFileModal from "@/components/modals/upload-file-modal";
import EditServerProfile from "@/components/modals/edit-server-profile";
import JoinServerModal from "../modals/join-server-modal";

const ModalProvider = () => {
  return (
    <>
      <CreateServerModal />
      <CreateCategoryModal />
      <CreateChannelModal />
      <UploadFileModal />
      <EditServerProfile />
      <JoinServerModal />
    </>
  );
};

export default ModalProvider;
