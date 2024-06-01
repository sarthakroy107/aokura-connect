import { z } from "zod";

export const registrationFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  username: z.string().min(1, { message: "Username is required" }),
  dateOfBirth: z.coerce.date({ required_error: "Date of birth is required" }),
});