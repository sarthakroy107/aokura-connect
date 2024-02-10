import CreateServerModal from '../modals/create-server-modal'
import CreateCategoryModal from '../modals/create-category-modal'
import CreateChannelModal from '../modals/create-channel-modal'
import UploadFileModal from '../modals/upload-file-modal'
import EditServerProfile from '../modals/edit-server-profile'

const ModalProvider = () => {
  
  return (
    <>
      <CreateServerModal />
      <CreateCategoryModal />
      <CreateChannelModal />
      <UploadFileModal />
      <EditServerProfile />
    </>
  )
}

export default ModalProvider