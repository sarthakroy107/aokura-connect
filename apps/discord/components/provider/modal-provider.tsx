import CreateServerModal from "@/components/modals/create-server-modal";
import CreateCategoryModal from "@/components/modals/create-category-modal";
import CreateChannelModal from "@/components/modals/create-channel-modal";
import UploadFileModal from "@/components/modals/upload-file-modal";
import EditServerProfile from "@/components/modals/edit-server-profile";
import JoinServerModal from "@/components/modals/join-server-modal";
import ModifyServerModal from "@/components/modals/modify-server-modal";
import ModifyCategoryModal from "@/components/modals/edit-category-modal";
import DeleteCategoryModal from "@/components/modals/delete-category";
import CreateInvitaionLinkModal from "@/components/modals/create-invitation-link";

const ModalProvider = () => {
  return (
    <>
      <CreateServerModal />
      <CreateCategoryModal />
      <CreateChannelModal />
      <UploadFileModal />
      <EditServerProfile />
      <JoinServerModal />
      <ModifyServerModal />
      <ModifyCategoryModal />
      <DeleteCategoryModal />
      <CreateInvitaionLinkModal />
    </>
  );
};

export default ModalProvider;
