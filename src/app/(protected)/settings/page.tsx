"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { settings } from "@/actionserver/settings";
import { useTransition } from "react";
import { useSession } from "next-auth/react";
import { SettingsSchema } from "@/schemas";
import {
  Form,
  FormField,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import FormError from "@/components/main/FormError";
import FormSuccess from "@/components/main/FormSuccess";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@prisma/client";
import { Switch } from "@/components/ui/switch";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";

const SettingsPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const user = useCurrentUser();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      password: undefined,
      newPassword: undefined,
      role: user?.role || undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    },
  });
  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    startTransition(() => {
      settings(values)
        .then((data) => {
          if (data.error) {
            setError(data?.error);
          }

          if (data.success) {
            update();
            setSuccess(data?.success);
          }
        })
        .catch(() => setError("Something Wrong!"));
    });
  };

  return (
    <div className="flex flex-col items-center justify-center pt-[150px]">
      <Card className="w-[550px]">
        <CardHeader>
          <p className="text-2xl font-semibold text-center">🎇Settings</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                {/* name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="john-doe"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* email */}
                {user?.isOAuth === false && (
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
                              placeholder="johndoe@mail.com"
                              disabled={isPending}
                              type="email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* password */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Old-Password</FormLabel>
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
                                {showPassword ? (
                                  <RiEyeFill />
                                ) : (
                                  <RiEyeOffFill />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* newPassword */}
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New-Password</FormLabel>
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
                                {showPassword ? (
                                  <RiEyeFill />
                                ) : (
                                  <RiEyeOffFill />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                {/* role */}
                {user?.role === "ADMIN" && (
                  <>
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select
                            disabled={isPending}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={UserRole.ADMIN}>
                                Admin
                              </SelectItem>
                              <SelectItem value={UserRole.USER}>
                                User
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* 2FA-CODE */}
                {user?.isOAuth === false && (
                  <FormField
                    control={form.control}
                    name="isTwoFactorEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="-space-y-0.5">
                          <FormLabel>2FA-Code</FormLabel>
                          <FormDescription>
                            Enable two Factor Authentication for your Account
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            disabled={isPending}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </div>
              <FormError message={error} />
              <FormSuccess message={success} />
              <Button className="mr-4" disabled={isPending} type="submit">
                Save
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
