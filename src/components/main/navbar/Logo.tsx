"use client"
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router=useRouter()
  return (
    <>
      <div>
        <Link href="/">
        <Image
          onClick={()=>router.push("/main")}
            className="hidden md:block"
            src="/images/bowler.jpg"
            alt="logo"
            width={38}
            height={38}
          />
        </Link>
      </div>
    </>
  );
};

export default Logo;