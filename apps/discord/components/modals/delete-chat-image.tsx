'use client';

import { useModal } from '@/lib/store/modal-store';
import { Dialog, DialogContent } from '@ui/components/ui/dialog'

const DeleteChatImageModal = () => {

  const { isOpen, type, onClose } = useModal();
  

  return (
    <Dialog open={isOpen} onOpenChange={ () => onClose() }>
      <DialogContent>

      </DialogContent>
    </Dialog>
  )
}

export default DeleteChatImageModal