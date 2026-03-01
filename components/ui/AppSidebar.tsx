"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, 
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem 
} from "./sidebar";
import { FolderKanban, Users, FileText, Star } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

export function AppSidebar() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Membungkus dengan requestAnimationFrame memastikan setMounted 
    // dipanggil setelah browser selesai melakukan render awal (paint),
    // sehingga mencegah "cascading renders" yang sinkron.
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });
    
    return () => cancelAnimationFrame(handle);
  }, []);

  // Normalisasi string role
  const currentRole = user?.role?.toLowerCase().replace(/\s+/g, '_');

  // Definisi Hak Akses - Pastikan mounted true agar tidak ada mismatch hidrasi
  const isSuperAdmin = mounted && currentRole === "super_admin";
  const isAdminOrHigher = mounted && (currentRole === "admin" || currentRole === "super_admin");

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              
              {/* 1. MANAGE PROJECTS */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/admin/projects">
                    <FolderKanban />
                    <span>Manage Projects</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* 2. MANAGE RATINGS */}
              {isAdminOrHigher && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/admin/ratings">
                      <Star className="text-yellow-400" />
                      <span>User Feedback</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {/* 3. MANAGE RESUME */}
              {isSuperAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                  <Link href="/admin/resume">
                    <FileText className="text-emerald-500" />
                    <span>Manage Resume</span>
                  </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {/* 4. MANAGE ADMINS */}
              {isSuperAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/admin/users">
                      <Users className="text-blue-500" />
                      <span>Manage Admins</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}