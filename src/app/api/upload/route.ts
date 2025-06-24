// /pages/api/upload.ts
import { auth } from "@/auth";
import { db } from "@/lib/db";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await auth();
  if (!session?.user?.id)
    return res.status(401).json({ error: "Not authenticated" });

  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Upload error" });

    if (!files.file || !Array.isArray(files.file) || files.file.length === 0) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const file = files.file[0];
    const ext = path.extname(file.originalFilename || "");
    const fileName = `${Date.now()}${ext}`;
    const folder = path.join(
      process.cwd(),
      "public",
      "uploads",
      session.user.id
    );
    const filePath = path.join(folder, fileName);

    fs.mkdirSync(folder, { recursive: true });

    // Read file from disk using the filepath property
    const data = await fs.promises.readFile(file.filepath);
    await fs.promises.writeFile(filePath, new Uint8Array(data));

    const relativeUrl = `/uploads/${session.user.id}/${fileName}`;

    const record = await db.file.create({
      data: {
        url: relativeUrl,
        filename: file.originalFilename || "",
        mimetype: file.mimetype || "",
        size: file.size,
        userId: session.user.id,
      },
    });

    return res.status(200).json({ file: record });
  });
}
