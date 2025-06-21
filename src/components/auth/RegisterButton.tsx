"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { Dialog } from "@/components/ui/dialog";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import RegisterForm from "./RegisterForm";

interface RegisterButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

const RegisterButton = ({
  children,
  mode = "redirect",
  asChild,
}: RegisterButtonProps) => {
  const router = useRouter();
  const onClick = () => {
    router.push("/register");
  };
  if (mode === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className="p-0 w-auto bg-transparent border-none">
          <RegisterForm />
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

export default RegisterButton;