import { getAllUsersWithLogs } from "@/actionserver/superadmin";
import TimerPing from "@/components/TimerPing";
import { Card, CardContent } from "@/components/ui/card";

export default async function SuperadminPage() {
  const users = await getAllUsersWithLogs()
  return (
    <div className="p-4 space-y-4 mt-4">
      <TimerPing/>
      <h1 className="text-2xl font-bold">Superadmin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent>
              <p>
                <strong>{user.name}</strong> ({user.email})
              </p>
              <p>Online: {user.online ? "✅" : "❌"}</p>
              <p>
                Last login:{" "}
                {user.loginLogs[0]?.loggedInAt?.toLocaleString() || "N/A"}
              </p>
              <p>IP: {user.loginLogs[0]?.ipAddress}</p>
              <p>Browser: {user.loginLogs[0]?.browser}</p>
              <p>Device:{user.loginLogs[0]?.device}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
