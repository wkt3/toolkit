// /app/api/ping/route.ts
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  await db.user.update({
    where: { id: session.user.id },
    data: { online: true },
  });

  return new Response("OK");
}
