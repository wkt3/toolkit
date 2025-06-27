import AppSideBar from "@/components/dashboard/AppSideBar";
import Navbar from "@/components/dashboard/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { cookies } from "next/headers";
import getCurrentUser from "@/actionserver/getCurrentUser";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import SuperadminLayout from "../(superadmin)/layout";
import ManagerLayout from "../(managers)/layout";
import UserLayout from "../(user)/layout";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

    const session = await auth();
      if (session?.user?.role === "SUPERADMIN") {
        return <SuperadminLayout>{children}</SuperadminLayout>;
      }
    
      if (session?.user?.role === "ADMIN") {
        return <ManagerLayout>{children}</ManagerLayout>;
      }
      if (session?.user?.role === "USER") {
        return <UserLayout>{children}</UserLayout>;
      }

  return (
    <SessionProvider>
      <div className="flex">
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSideBar />
          <main className="w-full">
            <Navbar currentUser={currentUser} />
            <div className="px-4">{children}</div>
          </main>
        </SidebarProvider>
      </div>
    </SessionProvider>
  );
}
