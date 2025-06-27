import { db } from "@/lib/db";

export default async function UsersPage() {
  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      provider: true,
      loginCount: true,
      totalOnlineMs: true,
    },
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Users</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {users.map((u) => (
          <div key={u.id} className="p-4 border rounded shadow">
            <p>
              <b>{u.name}</b> ({u.provider})
            </p>
            <p>Email: {u.email}</p>
            <p>Login Count: {u.loginCount}</p>
            <p>
              Total Online: {(Number(u.totalOnlineMs) / 60000).toFixed(1)}{" "}
              minutes
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
