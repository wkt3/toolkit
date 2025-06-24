// app/chat/page.tsx
import { auth } from "@/auth";
import ChatRoom from "@/components/chat/ChatRoom";

export default async function ChatPage() {
  const session = await auth();

  return (
    <main className="h-screen flex items-center justify-center">
      <ChatRoom
        roomId="general" // or match ID, etc.
        currentUser={{
          id: session?.user?.id || "",
          name: session?.user?.name || "User",
        }}
      />
    </main>
  );
}
