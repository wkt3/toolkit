"use client";
import React from "react";
import Link from "next/link";
import { LogOut, Settings, User2Icon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DarkMode } from "../theme/DarkMode";
import SidebarCollapseBtn from "./SidebarCollapseBtn";
import { User } from "next-auth";
import { AiOutlineMenu } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { AdapterUser } from "@/app/types";
import SignOutBtn from "@/app/(auth)/signout/page";

interface NavbarProps {
  currentUser?: AdapterUser | User | null;
}

const Navbar = ({ currentUser }: NavbarProps) => {
  const router = useRouter();
  // const {toggleSidebar } = useSidebar();
  const signUp = () => {
    router.push("/signup");
  };
  const signIn = () => {
    router.push("/signin");
  };
  return (
    <nav className="flex p-4 items-center justify-between">
      {/* left side */}
      <SidebarCollapseBtn />
      {/* <Button onClick={toggleSidebar} variant="outline">Custom Button</Button> */}
      {/* right side */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard">Dashboard</Link>
        {/* theme menu */}
        <DarkMode />
        {/* user Menu */}
        {currentUser ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage
                    src={currentUser?.image || "/images/placeholder.jpg"}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent sideOffset={10}>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User2Icon className="h-[1.2rem] w-[1.2rem] mr-3" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-[1.2rem] w-[1.2rem] mr-3" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <SignOutBtn />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <AiOutlineMenu />
              </DropdownMenuTrigger>
              <DropdownMenuContent sideOffset={20}>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signIn()}>
                  SignIn
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signUp()}>
                  SignUp
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
