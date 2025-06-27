// src/actions/makeManager.ts
"use server";

import { db } from "@/lib/db"; // your Prisma client
import { makeManagerSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import getCurrentUser from "./getCurrentUser";

export async function makeManagerAction(formData: FormData) {
  const parsed = makeManagerSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const { email } = parsed.data;

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "SUPERADMIN") {
    return { success: false, error: { email: ["Unauthorized"] } };
  }

  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    return { success: false, error: { email: ["User not found"] } };
  }

  if (user.role === "MANAGER") {
    return { success: false, error: { email: ["User is already a manager"] } };
  }

  await db.user.update({
    where: { email },
    data: { role: "MANAGER" },
  });

  revalidatePath("/admin/roles"); // if needed

  return { success: true };
}
