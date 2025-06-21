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
import { login } from "@/actionserver/login";
import { useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import { authLoginSliceSchema } from "@/store/slices/authLoginSliceSchema";


const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  //this is for 2fa
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  //this is the error callback url from browser bar
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already taken with different Provider!"
      : "";
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof authLoginSliceSchema>>({
    resolver: zodResolver(authLoginSliceSchema),
    defaultValues: {
      email: "",
      password: "",
      code:"",
    },
  });
  const onSubmit = (values: z.infer<typeof authLoginSliceSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }
          if (data?.success) {
            form.reset();
            setSuccess(data?.success);
          }
          //if 2fa enabled then we dnt reset form because we need credentials that user just inputs
          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => {
          setError("Something went Wrong!!");
        });
    });
  };
  return (
    <CardWrapper
      headerLabel="Welcome Back!"
      backButtonLabel="Don't have an Account"
      backButtonHref="/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="123456"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {/* without 2fa START*/}
            {!showTwoFactor && (
              <>
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
                      <Button
                        className="px-0 font-normal"
                        size="sm"
                        variant="link"
                        asChild
                      >
                        <Link href="/forgotpassword">Forgot Password</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {/* without 2fa ENDS */}
          </div>
          {/* here this error is callback and defined to display */}
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            {showTwoFactor ? "Confirm" : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
