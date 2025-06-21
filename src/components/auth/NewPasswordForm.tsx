"use client";
import * as z from "zod";
import React, { useState } from "react";
import CardWrapper from "./CardWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { NewPasswordSchema } from "@/schemas";
import FormError from "../main/FormError";
import FormSuccess from "../main/FormSuccess";
import { useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { newPassword } from "@/actionserver/newPassword";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";

const NewPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });
  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");
    console.log(values);

    startTransition(() => {
      //with values we are also getting token from newPassword server action
      newPassword(values, token).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };
  return (
    <CardWrapper
      headerLabel="Enter New Password!"
      backButtonLabel="Back to Sign-In"
      backButtonHref="/signin"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="flex items-center border rounded px-3 py-2">
                      <Input
                        {...field}
                        placeholder="******"
                        disabled={isPending}
                        type={showPassword ? "text" : "password"}
                        className="flex-grow outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="ml-2 text-gray-600"
                      >
                        {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            Reset Password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default NewPasswordForm;