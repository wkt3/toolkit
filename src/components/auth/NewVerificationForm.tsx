"use client";
import React, { useCallback, useState } from "react";
import CardWrapper from "./CardWrapper";
import { useRouter, useSearchParams } from "next/navigation";
import { newVerification } from "@/actionserver/newVerification";
import FormError from "../main/FormError";
import FormSuccess from "../main/FormSuccess";
import { Button } from "../ui/button";
import { SiSimplelogin } from "react-icons/si";

const NewVerificationForm = () => {
  const router=useRouter()
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  //HAVE TO GET TOKEN
  const token = searchParams.get("token");
  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Missing Token");
      return;
    }
    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        router.push("/signin")
        setError(data.error);
      })
      .catch(() => {
        setError("Something Went Wrong");
      });
  }, [token,router]);
  return (
    <CardWrapper
      headerLabel="Confirm your Verification"
      backButtonLabel="Back To Sign-In"
      backButtonHref="/signin"
    >
      <div className="flex flex-col items-center justify-center w-full">
        <SiSimplelogin className="h-20 w-20 text-orange-500" />
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button className="mt-2 hover:bg-orange-500" onClick={onSubmit}
        >
          Confirm
        </Button>
      </div>
    </CardWrapper>
  );
};

export default NewVerificationForm;