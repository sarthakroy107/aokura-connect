"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationFormSchema } from '@/lib/validations/auth-schemas'

import { cn } from "@/lib/utils";
import { Button } from "@ui/components/ui/button";
import { Form, FormField } from "@ui/components/ui/form";

import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";
import { checkUsernameAvailibility, registerUser } from "@/lib/server-actions/user/actions";
import DateInput from "@/components/form/date-input";
import NormalInput from "@/components/form/normal-input";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";


const RegistrationBox = () => {
  const form = useForm<z.infer<typeof registrationFormSchema>>({
    resolver: zodResolver(registrationFormSchema),
  });
  const [usernameAvailibility, setUsernameAvailibility] = useState<Awaited<
    ReturnType<typeof checkUsernameAvailibility>
  > | null>();
  const usernameWatch = form.watch("username");

  const [value] = useDebounce(usernameWatch, 1000);

  useEffect(() => {
    if (value && value.length > 0) {
      (async () => {
        const res = await checkUsernameAvailibility(value);
        if (res) {
          setUsernameAvailibility(res);
        }
      })();
    }
  }, [value]);

  const onRegistrationFormSubmit = async (
    values: z.infer<typeof registrationFormSchema>
  ) => {
    const res = await registerUser(values);
    if(res.status === 200) {
      toast.success("Account activation link sent to your email");
    }
    else {
      toast.error(res.message);
    };
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onRegistrationFormSubmit)}
        className="bg-discord px-11 pb-10 rounded-[3px] w-[480px]"
      >
        <h1 className="text-center text-2xl font-medium my-5">
          Create Acoount
        </h1>
        <NormalInput
          label="DISPLAY NAME"
          {...form.register("name")}
          required={true}
          error={form.formState.errors.name}
        />
        <NormalInput
          label="EMAIL"
          {...form.register("email")}
          required={true}
          error={form.formState.errors.email}
        />
        <NormalInput
          label="PASSWORD"
          {...form.register("password")}
          required={true}
          error={form.formState.errors.password}
        />
        <NormalInput
          label="USERNAME"
          {...form.register("username")}
          required={true}
          error={form.formState.errors.username}
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
              error={form.formState.errors.dateOfBirth}
              {...field}
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
          {form.formState.isSubmitting ? <BarLoader color="#ffffff" width={69} />: "Register"}
        </Button>
        <p className="text-[0.70rem] text-white/40 py-1 pt-2">
          By registering, you agree to{" "}
          <span className={cn(conditionsStyles)}>Terms of Service</span> and{" "}
          <span className={cn(conditionsStyles)}>Privacy Policy</span>
        </p>
        <Link href={"/signin"} className={cn("text-sm mt-5", conditionsStyles)}>
          Alreay have a account?
        </Link>
      </form>
    </Form>
  );
};

export default RegistrationBox;

const conditionsStyles = "text-discord_cyan hover:underline cursor-pointer";
