import React from "react";
import Image from "next/image";

interface AvatarProps{
  src : string|null|undefined
}

const Avatar = ({
  src
}:AvatarProps) => {
  return (
    <>
      <Image
        className="rounded-full hover:bg-orange-500 hover:text-white"
        src={src || "/images/placeholder.jpg"}
        alt="avatar"
        width={30}
        height={30}
      />
    </>
  );
};

export default Avatar;