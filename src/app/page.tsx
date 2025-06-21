import { Button } from "@/components/ui/button";
import LoginButton from "@/components/auth/LoginButton";

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <div className="space-y-6">
        <h1 className="text-6xl font-semibold drop-shadow-md">🔑Auth</h1>
        <p className="text:lg">A simple Authentication Service</p>
      </div>
      <div className="mt-4">
        <LoginButton mode="modal" asChild> 
          <Button variant="default" size="lg">
            SignIn
          </Button>
        </LoginButton>
      </div>
    </main>
  );
}
