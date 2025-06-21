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
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FormError from "../main/FormError";
import FormSuccess from "../main/FormSuccess";
import { register } from "@/actionserver/register";
import { useTransition } from "react";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import { authRegisterSliceSchema } from "@/store/slices/authRegisterSliceSchema";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof authRegisterSliceSchema>>({
    resolver: zodResolver(authRegisterSliceSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  //watch fields
  const name = form.watch("name");
  const email = form.watch("email");
  const password = form.watch("password");
  const debouncedName = useDebounce(name, 1000);
  const debouncedEmail = useDebounce(email, 1000);
  const debouncedPassword = useDebounce(password, 1000);

  const onSubmit = (values: z.infer<typeof authRegisterSliceSchema>) => {
    setError("");
    setSuccess("");
    // here these values comes from sever action/login
    //have to start transition for smooth ui and experience

    startTransition(() => {
      //you can send debounced fields here
      console.log("Submitting with debounce: ", {
        name: debouncedName,
        email: debouncedEmail,
        password: debouncedPassword,
      });
      register(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };
  return (
    <CardWrapper
      headerLabel="Create An Account 👽"
      backButtonLabel="Already have an Account?"
      backButtonHref="/signin"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="john-doe"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="johndoe@gmail.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
            Create Account
          </Button>
        </form>
      </Form>
      <p className="text-xs mt-2">
        By creating an account you agree to the{" "}
        <Link className="font-bold underline" href="/terms">
          Terms of Service
        </Link>{" "}
        and our
        <Link className="font-bold underline" href="/privacy">
          Privacy Policy
        </Link>{" "}
        . We'll occasionally send you emails about news, products, and services;
        you can opt-out anytime.
      </p>
    </CardWrapper>
  );
};

export default RegisterForm;
