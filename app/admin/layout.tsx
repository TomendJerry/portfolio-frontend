"use client";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/AppSidebar";
import { AuthProvider } from "@/app/context/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <div className="flex min-h-screen bg-[#0d1117] w-full">
          <AppSidebar />
          <SidebarInset className="bg-[#0d1117] flex-1">
            <header className="flex h-12 items-center gap-2 px-4 border-b border-[#30363d]">
              <SidebarTrigger className="text-gray-400" />
            </header>
            <div className="p-4">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
}