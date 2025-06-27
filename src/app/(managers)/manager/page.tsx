import { getManagersWithUsers } from "@/actionserver/getManagers";
import ManagerCard from "@/components/superadmin/ManagerCard";

export default async function ManagerPage() {
  const managers = await getManagersWithUsers();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Manage Managers</h1>

      <div className="grid gap-4 md:grid-cols-2">
        {managers.map((manager) => (
          <ManagerCard key={manager.id} manager={manager} />
        ))}
      </div>
    </div>
  );
}
