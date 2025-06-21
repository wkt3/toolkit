"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@prisma/client";
import React from "react";


interface AvatarProps {
  src?: string | null | undefined
  user: User
}

const AvatarImg: React.FC<AvatarProps> = ({ src,user}) => {
  return (
    <>
      <Avatar>
        <AvatarImage src={src || user?.image || "/images/placeholder.jpg"} />
        <AvatarFallback>CN</AvatarFallback>
        <span
          className="
      absolute
      block
      rounded-full
      bg-green-500
      ring-2
      ring-white
      top-2
      right-1
      h-1
      w-1
      md:h-2
      md:w-2
      "
        >
        </span>
      </Avatar>
    </>
  );
};

export default AvatarImg;