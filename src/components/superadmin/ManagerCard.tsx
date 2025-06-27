"use client";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { updateManagerPermissions } from "@/actionserver/getManagers";

type Manager = {
  id: string;
  user: {
    name: string;
    email: string;
  };
  canViewUsers: boolean;
  canViewLogs: boolean;
  canSendPromos: boolean;
  canManageQueries: boolean;
};

type ManagerPermission =
  | "canViewUsers"
  | "canViewLogs"
  | "canSendPromos"
  | "canManageQueries";

export default function ManagerCard({ manager }: { manager: Manager }) {
  const [state, setState] = useState(manager);

  const toggle = async (perm: ManagerPermission) => {
    const updated = {
      ...state,
      [perm]: !state[perm],
    };
    await updateManagerPermissions(manager.id, perm, !state[perm]);
    setState(updated);
  };

  return (
    <div className="p-4 border rounded-lg shadow">
      <p className="font-bold">
        {manager.user.name} ({manager.user.email})
      </p>
      <div className="space-y-2 mt-2">
        {(
          [
            "canViewUsers",
            "canViewLogs",
            "canSendPromos",
            "canManageQueries",
          ] as ManagerPermission[]
        ).map((perm) => (
          <div className="flex items-center justify-between" key={perm}>
            <label className="capitalize">
              {perm.replace("can", "").replace(/([A-Z])/g, " $1")}
            </label>
            <Switch
              checked={state[perm]}
              onCheckedChange={() => toggle(perm)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
