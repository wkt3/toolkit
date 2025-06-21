"use client";
// import useLoginModal from "@/app/hooks/useLoginModal";
// import useRegisterModal from "@/app/hooks/useRegisterModal";
import useRentModal from "@/app/hooks/useRentModal";
// import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import MenuItem from "./MenuItem";
import AvatarImg from "../main/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import logOut from "@/actionserver/logout";
// import AlertBox from "../main/AlertBox";

const DropDown = () => {
  const router = useRouter();
  // const registerModal = useRegisterModal();
  // const loginModal = useLoginModal();
  const rentModal = useRentModal();
  const currentUser = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  // const onClick = () => {
  //   AlertBox();
  // };

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const onRent = useCallback(() => {
    if (!currentUser) {
      return router.push("/signin");
    }
    //open rent modal if current user not logged in
    rentModal.onOpen();
  }, [currentUser, rentModal, router]);

  return (
    <div className="relative cursor-pointer ">
      <div
        className="
        flex-row
        items-center
        gap-3
        flex
        border-b-black
        dark:text-white
        "
      >
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
             transition
             cursor-pointer
             text-black
             dark:text-white
             border-b-2
             border-white
             "
        >
          🏆?🤞
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            onClick={toggleOpen}
            className="
            p-4
            md:py-1
            md:px-2
            border-[1px]
            border-white
            flex-row
            items-center
            gap-3
            rounded-full
            cursor-pointer
            hover:shadow-md
            transition
            inline-flex
            text-center
            dark:text-white
            "
          >
            <AiOutlineMenu />
            <div
              className="
          hidden
          md:block
          "
            >
              <AvatarImg src={currentUser?.image} />
            </div>
          </DropdownMenuTrigger>
          {isOpen && (
            <DropdownMenuContent>
              {currentUser ? (
                <>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="border-[1px] border-orange-500" />
                  <MenuItem
                    onClick={() => router.push("/trips")}
                    label="My Trips"
                  />
                  <MenuItem
                    onClick={() => router.push("/favorites")}
                    label="My Favorites"
                  />
                  <MenuItem
                    onClick={() => router.push("/settings")}
                    label="My Settings"
                  />
                  <MenuItem
                    onClick={() => router.push("/reservations")}
                    label="My Reservations"
                  />
                  <MenuItem
                    onClick={() => router.push("/properties")}
                    label="My Properties"
                  />
                  <MenuItem
                    onClick={() => router.push("/users")}
                    label="MyChat"
                  />
                  <MenuItem
                    onClick={() => router.push("/dashboard")}
                    label="My Dashboard"
                  />
                  <MenuItem onClick={rentModal.onOpen} label="Add Property" />
                  <DropdownMenuSeparator className="border-[1px] border-orange-500" />
                  <MenuItem onClick={()=>logOut()} label="LogOut" />
                </>
              ) : (
                <>
                  <MenuItem
                    onClick={() => router.push("/signin")}
                    label="SignIn"
                  />
                  <MenuItem
                    onClick={() => router.push("/register")}
                    label="Register"
                  />
                </>
              )}
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DropDown;