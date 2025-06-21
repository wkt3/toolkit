import AppSideBar from "@/components/dashboard/AppSideBar";
import Navbar from "@/components/dashboard/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { cookies } from "next/headers";
import getCurrentUser from "@/actionserver/getCurrentUser";


export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
  const currentUser= await getCurrentUser()
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <div className="flex">
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSideBar />
        <main className="w-full">
          <Navbar currentUser={currentUser}/>
          <div className="px-4">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
}
