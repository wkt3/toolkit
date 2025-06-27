"use client";

import axios from "axios";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  const handleSignOut = async () => {
    axios.post("/api/auth/custom-signout");
    await signOut({ callbackUrl: "/signin" });
  };

  return (
    <Button onClick={() => handleSignOut()}>
      <LogOut className="h-[1.2rem] w-[1.2rem] mr-3 " />
      LogOut
    </Button>
  );
}
