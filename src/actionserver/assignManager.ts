import { db } from "@/lib/db";


export async function assignManager(email: string) {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  return await db.manager.create({
    data: {
      userId: user.id,
    },
  });
}
