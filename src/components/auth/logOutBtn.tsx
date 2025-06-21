"use client";
//here both signout methods can be used
//both are defined
import logOut from "@/actionserver/logout";
import { signOut } from "next-auth/react";

interface LogOutBtnProps {
  children?: React.ReactNode;
}

import React from "react";

const logOutBtn = ({ children }: LogOutBtnProps) => {
  const onCLick = () => {
    logOut();
    signOut();
  };
  return (
    <span onClick={onCLick} className="cursor-pointer">
      {children}
    </span>
  );
};

export default logOutBtn;