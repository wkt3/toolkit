"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { Dialog } from "@/components/ui/dialog";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import LoginForm from "./LoginForm";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

const LoginButton = ({
  children,
  mode = "redirect",
  asChild,
}: LoginButtonProps) => {
  const router = useRouter();
  const onClick = () => {
    router.push("/signin");
  };
  if (mode === "redirect") {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className="p-0 w-auto border-none bg-transparent">
          <LoginForm />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};

export default LoginButton;