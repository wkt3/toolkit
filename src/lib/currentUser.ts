import { auth } from "@/auth";
import { db } from "./db";


export async function currentUser() {
  const session = await auth()
  if (!session?.user?.email) return null;
  return db.user.findUnique({ where: { email: session.user.email } });
}