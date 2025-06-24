import { db } from "@/lib/db";
import sharp from "sharp";
import { Buffer } from "buffer";    
// Importing necessary modules
import crypto from "crypto";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return new Response("No file uploaded", { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const data = Buffer.from(arrayBuffer);

  const image = sharp(data);
  const metadata = await image.metadata();

  const record = await db.file.create({
      data: {
        ...  , //add your other required fields here if needed...
        id: crypto.randomUUID(), // Generate a unique ID for the file
        filename: file.name, // Use name property from File
        originalName: file.name, // Use name property from File
        mimetype: file.type, // Use type property from File
        filepath: `uploads/${file.name}`,
        contenttype: file.type,
        size: file.size,
        width: metadata.width,
        height: metadata.height,
      },
  });
    return new Response(JSON.stringify(record), {
        status: 201,
        headers: {
        "Content-Type": "application/json",
        },
    });
}
