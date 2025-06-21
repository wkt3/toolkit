"use client"
import React from "react";
import { Button } from "../ui/button";
import UserBtn from "../main/navbar/UserBtn";
import { signOut } from "next-auth/react";


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
        <Button onClick={()=>signOut()} >
          SignOut
        </Button>
      </div>
    </div>
  );
};

export default PNavbar;
