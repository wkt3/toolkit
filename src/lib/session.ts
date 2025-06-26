import { auth } from "@/auth";


export const currentSession = async () => {
    const session = await auth();
    if (!session) {
      throw new Error("No session found");
    }
    const user = session?.user;
    if (!user) {
      throw new Error("No user found in session");
    }
  return session?.user;
};



export const currentUser = async () => {
  const session = await currentSession();
  return session;
};  