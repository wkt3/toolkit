"use client"
import React from 'react'
// import { GiAmericanFootballHelmet } from 'react-icons/gi';

interface HeadingProps{
  title: string;
  subTitle: string;
  center?: boolean;
}
const Heading = ({
  title,subTitle,center
}:HeadingProps) => {
  return (
    <>
      {/* <div className="flex flex-col justify-center items-center mt-5">
        <GiAmericanFootballHelmet
                className="flex w-full items-center justify-center mt-6"
                size={110}
        />
      </div> */}
      <div className={center ? "text-center" : "text-start"}>
        <div className="text-2xl font-bold">{title}</div>
        <div className="font-light mt-2">{subTitle}</div>
      </div>
    </>
  );
}

export default Heading