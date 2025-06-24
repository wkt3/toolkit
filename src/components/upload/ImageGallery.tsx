// components/upload/ImageGallery.tsx
"use client";

import Image from "next/image";

export default function ImageGallery({ files }: { files: any[] }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {files.map((file) => (
        <div key={file.id} className="border rounded p-2">
          <Image
            src={file.url}
            height={250}
            width={250}
            alt={file.filename}
            className="w-full h-40 object-cover"
          />
          <p className="text-xs text-center mt-1">{file.filename}</p>
        </div>
      ))}
    </div>
  );
}
