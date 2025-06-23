"use client";
import * as z from "zod";
import React, { useState } from "react";
import CardWrapper from "./CardWrapper";
import { Controller, useForm } from "react-hook-form";
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
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import Image from "next/image";

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
      agree: true,
      confirm:"",
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
      <div className="flex flex-col items-center justify-center w-full">
      <p className="text-sm text-muted-foreground">
        Create your account to start betting
      </p>
      <p className="text-xs mt-1 font-medium text-orange-600 uppercase tracking-wide">
        Play. Predict. Win.
      </p>
      {/* 🔗 Links */}
      <div className="flex justify-center gap-4 text-sm">
        <Link href="/games" className="text-blue-600 underline">
          Explore Games
        </Link>
        <Link href="/how-to-play" className="text-blue-600 underline">
          How to Play
        </Link>
      </div>
      </div>

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
          <Controller
            control={form.control}
            name="agree"
            defaultValue={true}
            render={({ field }) => (
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agree"
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(Boolean(checked))
                  }
                />
                <Label htmlFor="agree">
                  I agree to the{" "}
                  <Link href="/terms" className="underline text-blue-600">
                    Terms & Conditions
                  </Link>
                </Label>
              </div>
            )}
          />
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
        . We&apos;ll occasionally send you emails about news, products, and
        services; you can opt-out anytime.
      </p>
    </CardWrapper>
  );
};

export default RegisterForm;
