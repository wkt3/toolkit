// components/upload/FileUploader.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function FileUploader({
  onUpload,
}: {
  onUpload?: (file: any) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploading(false);

    if (res.ok) {
      toast.success("Uploaded!");
      onUpload?.(data.file);
    } else {
      toast.error(data.error || "Upload failed");
    }
  };

  return (
    <div className="space-y-2">
      <Input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && (
        <p className="text-sm text-muted-foreground">Uploading...</p>
      )}
    </div>
  );
}
