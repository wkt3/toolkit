// src/pages/api/user/profile.ts

import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await auth();
  if (!session?.user?.email) return res.status(401).end();

  const { name, email, currentPassword, newPassword } = JSON.parse(req.body);

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return res.status(404).json({ message: "User not found" });

  const valid = await bcrypt.compare(currentPassword, user.password ?? "");
  if (!valid)
    return res.status(403).json({ message: "Invalid current password" });

  const updates: Partial<{ name: string; email: string; password: string }> =
    {};
  if (name && name !== user.name) updates.name = name;
  if (email && email !== user.email) updates.email = email; // optional: trigger email verification

  if (newPassword) {
    const newHash = await bcrypt.hash(newPassword, 10);
    if (await bcrypt.compare(newPassword, user.password ?? "")) {
      return res
        .status(400)
        .json({ message: "New password must be different" });
    }
    updates.password = newHash;
  }

  await db.user.update({
    where: { id: user.id },
    data: updates,
  });

  res.status(200).json({ message: "Updated successfully" });
}
