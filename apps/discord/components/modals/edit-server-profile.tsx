'use client';

import { useForm } from "react-hook-form";
import { ModalEnum, useModal } from "@/lib/store/modal-store"
import { useParams } from "next/navigation";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import DisplayImageChange from "@/components/common/dp-change";
import useCurrentServer from "@/components/hooks/use-current-member";
import { toast } from "sonner";
import { useEffect } from "react";
import { changeName } from "@/lib/server-actions/put/common";


const EditServerProfile = () => {
  const params = useParams<{ serverId: string }>()
  const { isOpen, type, onClose } = useModal()
  const { member } = useCurrentServer(params!.serverId)

  const isModalOpen = isOpen && type === ModalEnum.EDIT_SERVER_PROFILE
  const name: string = member?.nickname!
  console.log({name})
  const form = useForm<{ name: string }>({ defaultValues: { name: name } });

  const onSubmit = async (value: { name: string }) => {
    try {
      await changeName({ id: member?.id!, name: value.name, type: 'member' })
      toast.success('Name changed successfully')
      onClose();
    } catch (error) {
      console.log(error)
      toast.error('Something went wrong in db')
    }
  }

  useEffect(() => {
    form.setValue('name', name)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member])

  if (!member) return null

  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()} >
      <DialogContent className="flex flex-col items-center bg-discord p-0 pt-7">
        <DialogHeader className="text-2xl font-medium">Edit Sever Profile</DialogHeader>
        <DisplayImageChange currentImage={member?.server_avatar!} endpoint="profileImage" id={member?.id!} type="member" />
        <div className="w-full px-5">
          <Label className="text-base uppercase">Server Nickname</Label>
          <Input className="bg-discord_darkest focus-visible:ring-0 focus-visible:ring-offset-0 mt-2"
            placeholder="BE UNIQUE" {...form.register('name')} />
        </div>
        <div className="w-full flex justify-end items-center h-16 bg-discord_darker rounded-b-md mt-3">
          <Button className=" mr-4 bg-discord_purple text-white font-semibold" onClick={form.handleSubmit(onSubmit)}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditServerProfile