// src/components/admin/SuperAdminDashboard.tsx
"use client";

import useSWR from "swr";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { debounce } from "lodash";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SuperAdminDashboard() {
  const [query, setQuery] = useState("");
  const { data, isLoading } = useSWR(
    `/api/admin/users?query=${query}`,
    fetcher
  );

  const onSearch = debounce((q: string) => setQuery(q), 300);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">SuperAdmin Dashboard</h1>

      {/* 🔍 Search */}
      <div className="max-w-sm">
        <Input
          placeholder="Search users..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* 📊 Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-xl font-bold">
              {data?.stats.totalUsers ?? "--"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Cricket Users</p>
            <p className="text-xl font-bold">
              {data?.stats.cricketUsers ?? "--"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Storage Used</p>
            <p className="text-xl font-bold">
              {data?.stats.storageUsed ?? "--"} MB
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 🧑‍💻 User Table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full table-auto border text-sm">
          <thead>
            <tr className="bg-neutral-100 dark:bg-neutral-800">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Game</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.users?.map((user: any) => (
              <tr key={user.id} className="border-b">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.favoriteGame || "N/A"}</td>
                <td className="p-2">
                  {user.online ? "🟢 Online" : "⚪ Offline"}
                </td>
                <td className="p-2">
                  <Button size="sm" variant="secondary">
                    View Logs
                  </Button>
                </td>
              </tr>
            )) || (
              <tr>
                <td
                  colSpan={5}
                  className="p-2 text-center text-muted-foreground"
                >
                  {isLoading ? "Loading..." : "No users found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
