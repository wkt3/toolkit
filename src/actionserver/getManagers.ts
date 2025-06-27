import { db } from "@/lib/db";

export async function getManagersWithUsers() {
  return await db.manager.findMany({
    include: {
      user: true,
    },
  });
}

export async function updateManagerPermissions(
  managerId: string,
  field: string,
  value: boolean
) {
  return await db.manager.update({
    where: { id: managerId },
    data: {
      [field]: value,
    },
  });
}
