"use client";
import React from "react";
import UserBtn from "../main/navbar/UserBtn";
import SignOutBtn from "@/app/(auth)/signout/page";

const PNavbar = () => {
  return (
    <div className="fixed w-full z-10  border-b-2 border-orange-2 box-shadow-none bg-white dark:bg-black">
      <div
        className="
        py-4
      "
      >
        <UserBtn />
      </div>
      <div className="float-right">
        <SignOutBtn />
      </div>
    </div>
  );
};

export default PNavbar;
