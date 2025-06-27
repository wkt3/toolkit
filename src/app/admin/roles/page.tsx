// src/app/admin/roles/page.tsx (or wherever you need)
import { MakeManagerForm } from "@/components/admin/MakeManagerForm";

export default function RoleAssignmentPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Assign Manager Role</h1>
      <MakeManagerForm />
    </div>
  );
}
