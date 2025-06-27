// src/components/admin/MakeManagerForm.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { makeManagerAction } from "@/actionserver/makeManager";

export function MakeManagerForm() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<{
    success: boolean;
    error?: Record<string, string[]>;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("email", email);

    const res = await makeManagerAction(formData);
    setResult(res);
    setLoading(false);
    if (res.success) setEmail("");
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 p-4 max-w-md mx-auto border rounded-xl shadow-md"
    >
      <Label htmlFor="email">User Email</Label>
      <Input
        id="email"
        type="email"
        name="email"
        placeholder="Enter user email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Assigning..." : "Make Manager"}
      </Button>

      {result?.success && (
        <p className="text-green-600">User assigned as manager ✅</p>
      )}
      {result?.error && (
        <ul className="text-red-500 text-sm list-disc pl-4">
          {Object.values(result.error)
            .flat()
            .map((err, i) => (
              <li key={i}>{String(err)}</li>
            ))}
        </ul>
      )}
    </form>
  );
}
