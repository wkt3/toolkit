// pages/api/auth/custom-signout.ts
import { db } from "@/lib/db";
import { currentSession } from "@/lib/session";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session =await currentSession()
  

  if (session?.user?.email) {
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (user?.currentLogin) {
      const duration = Date.now() - new Date(user.currentLogin).getTime();

      await db.user.update({
        where: { email: session.user.email },
        data: {
          totalOnlineMs:
            BigInt(user.totalOnlineMs.toString()) + BigInt(duration),
          currentLogin: null,
        },
      });
    }
  }

  // Sign out using NextAuth
  const { signOut } = await import("next-auth/react");
  await signOut({ redirect: false });
  res.status(200).json({ message: "Signed out and session duration recorded" });
}
