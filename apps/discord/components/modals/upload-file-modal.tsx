'use client';

import * as z from 'zod';
import { useForm } from "react-hook-form";
import { ModalEnum, useModal } from "@/lib/store/modal-store";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FileUpload } from "../file-upload";


const UploadFileModal = () => {

  const formSchema = z.object({
    file_url: z.string().url(),
  })

  const { isOpen, type, onClose, setFileUrl } = useModal();
  const form = useForm<z.infer<typeof formSchema>>();

  const isModalOpen = isOpen && type === ModalEnum.UPLOAD_FILE;
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      console.log(data);
      setFileUrl(data.file_url);
      form.reset();
      onClose();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      <DialogContent className="bg-discord rounded-[2px] p-0 w-full">
        <DialogHeader className="text-2xl font-semibold mt-8 ml-48 px-6mb-0 pb-0">Upload file</DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="file_url"
              control={form.control}
              render={({ field }) => (
                <FormItem className='mx-8 flex justify-center'>
                  <FormControl>
                    <FileUpload onChange={field.onChange} value={field.value} endpoint='messageFile' />
                  </FormControl>
                </FormItem>
              )}

            />

            <DialogFooter className="bg-discord_darker mt-4 w-full">
              <Button disabled={isLoading} type="submit" className="bg-discord_purple text-white m-3 hover:bg-discord_purple">Send</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default UploadFileModal