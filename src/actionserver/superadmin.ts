import { db } from "@/lib/db";

export async function getAllUsersWithLogs() {
  return await db.user.findMany({
    include: {
      loginLogs: {
        orderBy: { loggedInAt: "desc" },
        take: 1,
      },
    },
  });
}
export async function getAllUsers() {
  return await db.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}