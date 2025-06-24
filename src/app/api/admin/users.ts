// /pages/api/admin/users.ts

import { db } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const queryParam = req.query.query || "";
  const query = Array.isArray(queryParam) ? queryParam[0] : queryParam;

  const users = await db.user.findMany({
    where: {
      OR: [
        { email: { contains: query, mode: "insensitive" } },
        { name: { contains: query, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  // Example fake stats:
  const stats = {
    totalUsers: users.length,
    cricketUsers: 0, // users.filter((u) => u.favoriteGame === "cricket").length, // Adjusted since favoriteGame is not selected
    storageUsed: 48.9, // replace with actual usage check
  };

  res.status(200).json({ users, stats });
}