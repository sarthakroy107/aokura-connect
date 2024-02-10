'use client';

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { useParams} from "next/navigation";
import { toast } from "sonner";
import { ModalEnum, useModal } from "@/lib/store/modal-store";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import useCurrentServer from "../hooks/use-current-member";

type TChatInputProps = {
  name: string,
  type: 'channel' | 'me',
  serverId: string,
  channelId: string,
}

const formSchema = z.object({
  content: z.string().optional(),
  file_url: z.string().optional()
}).refine(data => {
  if(!data.content && !data.file_url) {
    throw new Error('Message text content and file_url both are empty')
  }
})

const ChatInput = ({ name, type, serverId, channelId }: TChatInputProps) => {
  const params = useParams<{serverId: string, channelId: string}>()
  const { onOpen, file_url, data, setFileUrl } = useModal()

  const { member } = useCurrentServer(params!.serverId)

  const form = useForm<z.infer<typeof formSchema>>({
    //resolver: zodResolver(formSchema)
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if(isSubmitting) return;
    try {
      file_url && (values.file_url = file_url);

      if(!member || !member.id) {
        throw new Error('Member not found')
      }
      await fetch(`/api/socket/messages?c_id=${channelId}&s_m_id=${member?.id}`, {
        method: 'POST',
        body: JSON.stringify(values)
      })

      form.reset({
        content: '',
        file_url: ''
      });
      setFileUrl(null)

      toast.success('Message sent')
    } catch (error) {
      console.log(error);
      toast.error('something went wrong')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[85%] fixed bottom-0 p-1 mb-3 px-3 rounded-xl">
        {
          file_url && (
            <div className="w-full h-48 py-1 bg-disord_lighter">
              <Image width={400} height={400} src={file_url} alt="upload" className="w-64 h-44 object-contain" />
            </div>
          )
        }
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className={cn('w-full px-2 bg-disord_lighter rounded-b-md', !file_url && 'rounded-t-md')}>
              <FormControl className="w-full">
                <div className="w-full flex text-gray-400">
                  <button type="button" className="" onClick={() => onOpen(ModalEnum.UPLOAD_FILE, {})}>
                    <PlusCircle />
                  </button>
                  <Input disabled={isSubmitting} {...field}
                    className="w-[80%] bg-disord_lighter border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder={`Message #${name} as ${data.member?.id}`} />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export default ChatInput