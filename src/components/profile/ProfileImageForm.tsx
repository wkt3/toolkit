"use client";
import Image from "next/image";
import { useState } from "react";
import { Input } from "../ui/input";

export default function ProfileImageForm({
  currentImage,
}: {
  currentImage?: string;
}) {
  const [imageUrl, setImageUrl] = useState(currentImage || "");
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append("image", file);

    setUploading(true);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    setUploading(false);

    if (data.url) {
      setImageUrl(data.url);
      // ✅ Send this to update user profile image in DB
    }
  }

  return (
    <div className="space-y-4">
      {imageUrl && <Image height={100} width={100} src={imageUrl} className="w-32 h-32 rounded-full" />}
      <Input type="file" accept="image/*" onChange={handleUpload} />
      {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
    </div>
  );
}
