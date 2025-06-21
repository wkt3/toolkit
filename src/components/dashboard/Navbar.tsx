"use client";
import React from "react";
import Link from "next/link";
import { LogOut, Settings, User2Icon } from "lucide-react";
import { AvatarFallback, AvatarImage } from "../ui/avatar";
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
import Avatar from "@/components/main/Avatar";

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
                <Avatar src={currentUser?.image} />
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
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="text-destructive"
                >
                  <Link href="/signin">
                    <LogOut className="h-[1.2rem] w-[1.2rem] mr-3" />
                    LogOut
                  </Link>
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
