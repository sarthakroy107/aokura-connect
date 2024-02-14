import { z } from 'zod'

export const  serverFormSchema = z.object({
  name: z.string().min(1, { message: "Server name is required" }).max(30, { message: "Server name must be less than 30 characters" }),
  avatar: z.string().url({ message: "Avatar must be a valid URL" }).optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')).nullable(),
  is_private: z.boolean(),
  is_joining_allowed: z.boolean(),
})