"use client";
import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "../Avatar";
import MenuItem from "./MenuItem";
import { User } from "next-auth";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {  LogOut, PlusCircleIcon, Receipt, Settings, User2Icon } from "lucide-react";
import { signOut } from "next-auth/react";
import { useCallback } from "react";
import useRentModal from "@/hooks/useRentModal";
import { RiProfileFill } from "react-icons/ri";
import { FaTeamspeak } from "react-icons/fa";
import { AdapterUser } from "@/app/types";

interface UserMenuProps {
  currentUser?: |AdapterUser|User | null;
}

const UserMenu = ({ currentUser }: UserMenuProps) => {
  const rentModal = useRentModal();
  const router = useRouter();

  const signUp = () => {
    router.push("/register");
  };
  const signIn = () => {
    router.push("/signin");
  };
  const onRent = useCallback(() => {
    if (!currentUser) {
      return router.push("/signin");
    }
    //open rentModal
    rentModal.onOpen();
  }, [currentUser, router, rentModal]);

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={onRent}
          className="
          hidden
           md:block
           text-sm
           font-semibold
           py-3
           px-4
           rounded-full
           hover:bg-neutral-100
           transition
           cursor-pointer
           "
        >
          Airbnb Home
        </div>
        <div
          className="
          p-4
          md:py-1
          md:px-2
          border-[1px]
          border-neutral-200
          flex
          flex-row
          items-center
          gap-3
          rounded-full
          cursor-pointer
          hover:shadow-md
          transition
          "
        >
          <div
            className="
          flex
          flex-col
          cursor-pointer
          "
          >
            {currentUser ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <AiOutlineMenu />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent sideOffset={10}>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={rentModal.onOpen}>
                      <PlusCircleIcon className="h-[1.2rem] w-[1.2rem] mr-3 cursor-pointer" />
                      Category
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <User2Icon className="h-[1.2rem] w-[1.2rem] mr-3 cursor-pointer" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="h-[1.2rem] w-[1.2rem] mr-3 cursor-pointer" />
                      Settings
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <FaTeamspeak className="h-[1.2rem] w-[1.2rem] mr-3 cursor-pointer" />
                      Team
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <RiProfileFill className="h-[1.2rem] w-[1.2rem] mr-3 cursor-pointer" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Receipt className="h-[1.2rem] w-[1.2rem] mr-3 cursor-pointer" />
                      Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="text-destructive"
                    >
                      <LogOut className="h-[1.2rem] w-[1.2rem] mr-3" />
                      LogOut
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <div
                  className="
                  p-4
                  md:py-1
                  md:px-2
                  border-[1px]
                  border-neutral-200
                  flex
                  flex-row
                  items-center
                  gap-3
                  rounded-full
                  cursor-pointer
                  hover:shadow-md
                  transition
                  "
                >
                  <div
                    className="
                   flex
                   flex-col
                   cursor-pointer
                   "
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <AiOutlineMenu />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent sideOffset={20}>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <MenuItem onClick={() => signIn()} label="SignIn" />
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MenuItem onClick={() => signUp()} label="SignUp" />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="hidden md:block">
            <Avatar src={currentUser?.image} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
