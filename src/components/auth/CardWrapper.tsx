"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardFooter } from "../ui/card";
import Header from "./Header";
import Social from "./Social";
import BackButton from "./BackButton";
import { GiAmericanFootballHelmet } from "react-icons/gi";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

const CardWrapper = ({
  children,
  headerLabel,
  backButtonHref,
  backButtonLabel,
  showSocial,
}: CardWrapperProps) => {
  return (
    <>
      <Card className="w-[400px] shadow-md">
        <GiAmericanFootballHelmet
          className="flex w-full items-center justify-center mt-6"
          size={110}
        />
        <CardHeader>
          <Header label={headerLabel} />
        </CardHeader>
        <CardContent>{children}</CardContent>
        {showSocial && (
          <CardFooter>
            <Social />
          </CardFooter>
        )}
        <CardFooter>
          <BackButton label={backButtonLabel} href={backButtonHref} />
        </CardFooter>
      </Card>
    </>
  );
};
export default CardWrapper;