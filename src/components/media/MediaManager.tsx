"use client";

import useSWR from "swr";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function MediaManager() {
  const [query, setQuery] = useState("");
  const { data, mutate } = useSWR(`/api/files?query=${query}`);

  const deleteFile = async (id: string) => {
    const res = await fetch(`/api/files/${id}`, { method: "DELETE" });
    if (res.ok) mutate();
  };

  return (
    <div className="p-6 space-y-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">📁 My Media Library</h1>
        <Input
          placeholder="Search files..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data?.files?.map((file) => (
          <Card key={file.id} className="relative group">
            <Image
                    src={file.url}
                    height={250}
                    width={250}
              alt={file.filename}
              className="w-full h-40 object-cover rounded"
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
              <Button
                size="sm"
                variant="destructive"
                onClick={() => deleteFile(file.id)}
              >
                Delete
              </Button>
            </div>
            <div className="text-xs mt-1 text-center text-muted-foreground">
              {file.tag || "—"}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
