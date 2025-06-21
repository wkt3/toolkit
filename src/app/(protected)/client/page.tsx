"use client"
import React from "react";
import UserInfo from "@/components/main/UserInfo";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const ClientPage = () => {
  const user = useCurrentUser()
  return <UserInfo label="🌎 Client Component" user={user} />;
};

export default ClientPage;
