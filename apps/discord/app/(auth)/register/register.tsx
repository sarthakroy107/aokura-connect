"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationFormSchema } from "@/lib/validations/auth-schemas";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

import { checkUsernameAvailibility } from "./_actions/check-username-availiblity";
import type { TAPIRegisterUserResponse } from "@/app/api/register/route";

import { BarLoader } from "react-spinners";
import { toast } from "sonner";
import { LucideMailCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@ui/components/ui/button";
import { Form, FormField } from "@ui/components/ui/form";
import DateInput from "@/components/form/date-input";
import NormalInput from "@/components/form/normal-input";

const RegistrationBox = () => {
  const form = useForm<z.infer<typeof registrationFormSchema>>({
    resolver: zodResolver(registrationFormSchema),
  });
  const [usernameAvailibility, setUsernameAvailibility] = useState<Awaited<
    ReturnType<typeof checkUsernameAvailibility>
  > | null>(); // State to check username availibility

  const [emailSent, setEmailSent] = useState(false); // State to check if email has been sent
  const usernameWatch = form.watch("username"); // Watch the username input
  const [value] = useDebounce(usernameWatch, 1000); // Debounce the username check

  useEffect(() => {
    if (value && value.length > 0) {
      (async () => {
        const res = await fetch("/api/check-username", {
          method: "PUT",
          cache: "no-cache",
          body: JSON.stringify(value),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const body = await res.json();
        if (res.status !== 200) {
          setUsernameAvailibility({
            available: body,
            message: "Error occured while checking username",
            username: value,
          });
        } else if (!body.error) {
          console.log(body);
          setUsernameAvailibility(body);
          console.log(usernameAvailibility);
        } else
          setUsernameAvailibility({
            available: false,
            message: body.error,
            username: value,
          });
      })(); // Check username availibility
    }
  }, [value]);

  useEffect(()=>{

  }, [usernameAvailibility])

  const onRegistrationFormSubmit = async (
    // Function to handle form submit
    values: z.infer<typeof registrationFormSchema>
  ) => {
    
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const body = (await res.json()) as TAPIRegisterUserResponse;
    if (res.status === 200 && body.message) {
      toast.success(body.message);
      setEmailSent(true);
    } else {
      toast.error(body.error || "Error occured while sending email");
    }
  };

  return (
    <>
      {emailSent ? (
        <div className="auth-box">
          <LucideMailCheck
            height={58}
            width={65}
            className="text-discord_teal"
          />
          <p className="mt-3 text-center text-white/75">
            Activation link has been sent to
          </p>
          <strong className="mt-0.5 font-medium text-lg">
            sarthakroy2003@gmail.com
          </strong>
          <p className="mt-5 text-rose-500/75">Link is valid for 1 hour</p>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onRegistrationFormSubmit)}
            className="bg-discord px-11 h-[38.5rem] pb-10 rounded-[3px] w-[390px] md:w-[420px] lg:w-[480px]"
          >
            <h1 className="text-center text-2xl font-medium my-5">
              Create Acoount
            </h1>
            <NormalInput
              label="DISPLAY NAME"
              {...form.register("name")}
              required={true}
              error={form.formState.errors.name}
              disabled={form.formState.isSubmitting}
            />
            <NormalInput
              label="EMAIL"
              {...form.register("email")}
              required={true}
              error={form.formState.errors.email}
              disabled={form.formState.isSubmitting}
            />
            <NormalInput
              label="PASSWORD"
              {...form.register("password")}
              required={true}
              error={form.formState.errors.password}
              disabled={form.formState.isSubmitting}
            />
            <NormalInput
              label="USERNAME"
              {...form.register("username")}
              required={true}
              error={form.formState.errors.username}
              disabled={form.formState.isSubmitting}
              containerClassName="my-0 py-1"
            >
              <div className="h-2">
                {usernameAvailibility?.available &&
                  usernameWatch === usernameAvailibility?.username && (
                    <p className="text-discord_green text-sm">
                      {usernameAvailibility.message}
                    </p>
                  )}
                {!usernameAvailibility?.available &&
                  usernameWatch === usernameAvailibility?.username && (
                    <p className="text-discord_red text-sm">
                      {usernameAvailibility?.message}
                    </p>
                  )}
              </div>
            </NormalInput>
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <DateInput
                  label="DATE OF BIRTH"
                  required={true}
                  disabled={form.formState.isSubmitting}
                  error={form.formState.errors.dateOfBirth}
                  {...field}
                  className="w-full"
                />
              )}
            />
            <Button
              disabled={
                form.formState.isSubmitting ||
                !usernameAvailibility ||
                usernameAvailibility?.available === false ||
                usernameWatch !== usernameAvailibility?.username
              }
              type="submit"
              className="w-full mt-5 bg-discord_blurple rounded-[3px] hover:bg-discord_blurple text-white"
            >
              {form.formState.isSubmitting ? (
                <BarLoader color="#ffffff" width={69} />
              ) : (
                "Register"
              )}
            </Button>
            <p className="text-[0.70rem] text-white/40 py-1 pt-2">
              By registering, you agree to{" "}
              <span className={cn(conditionsStyles)}>Terms of Service</span> and{" "}
              <span className={cn(conditionsStyles)}>Privacy Policy</span>
            </p>
            <Link
              href={"/signin"}
              className={cn("text-sm mt-5", conditionsStyles)}
            >
              Alreay have a account?
            </Link>
          </form>
        </Form>
      )}
    </>
  );
};

export default RegistrationBox;

const conditionsStyles = "text-discord_cyan hover:underline cursor-pointer";
