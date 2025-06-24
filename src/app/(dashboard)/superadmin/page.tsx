// /app/superadmin/page.tsx
import SuperAdminDashboard from "@/components/superadmin/SuperAdminDashboard";
import {stats} from "../../api/files/usage/route"

export default function SuperAdminPage() {
  return (
    <main className="p-6 max-w-7xl mx-auto">
      <SuperAdminDashboard />
      <p>Total Files: {stats._count._all}</p>
      <p>Total Size: {((stats._sum.size ?? 0) / 1024 / 1024).toFixed(2)} MB</p>
    </main>
  );
}
