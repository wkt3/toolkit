import React from "react";
import CardWrapper from "./CardWrapper";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Ooops!! Something Went Wrong!!"
      backButtonLabel="Back To Sign-In"
      backButtonHref="/signin"
    >
      <div className="flex flex-col items-center justify-center ">
        <ExclamationTriangleIcon className="w-20 h-20 text-orange-400" />
      </div>
    </CardWrapper>
  );
};

export default ErrorCard;
