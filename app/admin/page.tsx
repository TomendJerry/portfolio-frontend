"use client";

import { useAuth } from "@/app/context/AuthContext";
import { LayoutDashboard, Activity, Database, Users } from "lucide-react";

export default function AdminOverview() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="border-b border-[#30363d] pb-6">
        <h1 className="text-2xl font-mono text-white flex items-center gap-3 uppercase tracking-tighter">
          <LayoutDashboard className="text-cyan-400" /> System_Overview
        </h1>
        <p className="text-xs text-gray-500 font-mono mt-1 uppercase">
          Welcome_Back: <span className="text-gray-300">{user?.full_name || "ADMIN"}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-2xl">
          <Activity className="text-emerald-400 mb-4" size={24} />
          <div className="text-2xl font-bold text-white">Active</div>
          <div className="text-[10px] font-mono text-gray-500 uppercase">System_Status</div>
        </div>
        <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-2xl">
          <Database className="text-cyan-400 mb-4" size={24} />
          <div className="text-2xl font-bold text-white">Database</div>
          <div className="text-[10px] font-mono text-gray-500 uppercase">Connected_to_PostgreSQL</div>
        </div>
        <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-2xl">
          <Users className="text-purple-400 mb-4" size={24} />
          <div className="text-2xl font-bold text-white">{user?.role}</div>
          <div className="text-[10px] font-mono text-gray-500 uppercase">Current_Access_Level</div>
        </div>
      </div>
    </div>
  );
}