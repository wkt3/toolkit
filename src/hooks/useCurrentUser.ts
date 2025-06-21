"use client"
// to avoid getting data.user.name from useSession
//directly using a useCurrentUser hook

import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
  const session = useSession()
  return session.data?.user;
};
