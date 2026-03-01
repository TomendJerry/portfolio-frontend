"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ShieldCheck, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. UBAH INI: Gunakan URLSearchParams untuk format Form-Data
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // 3. Simpan data user dan token secara lengkap
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("access_token", data.access_token); // Simpan Token JWT
        localStorage.setItem("user_data", JSON.stringify(data.user)); // Simpan Objek User (role, name, dll)
        localStorage.setItem("user_session", data.user.username);
        
        router.push("/admin"); 
      } else {
        // 4. Perbaikan penanganan error agar tidak me-render objek
        const errorDetail = typeof data.detail === 'object' 
          ? "Format data tidak sesuai" 
          : data.detail;
        setError(errorDetail || "AUTH_FAILED");
      }
    } catch (err) {
      setError("NETWORK_ERROR_CHECK_BACKEND");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-[#161b22] border border-[#30363d] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* 1. Pastikan Glow Effect tidak menutupi tombol (z-index) */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl -z-10"></div>
        
        {/* 2. Tombol Back dengan Link Next.js yang Benar */}
        <Link 
          href="/" 
          className="relative z-10 inline-flex items-center gap-2 text-xs text-gray-500 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> 
          BACK_TO_LAB
        </Link>

        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-cyan-500/10 rounded-xl mb-4 border border-cyan-500/20">
            <ShieldCheck className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-mono text-white tracking-tighter">GATEKEEPER_v1</h1>
          <p className="text-gray-500 text-[10px] font-mono mt-2 uppercase tracking-widest">System Authentication Required</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-gray-500 uppercase">Identity_ID</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-600" />
              <input required type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-cyan-500/50 transition-all text-white" 
                placeholder="username" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono text-gray-500 uppercase">Access_Key</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-600" />
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-cyan-500/50 transition-all text-white" 
                placeholder="password" />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-[10px] text-red-400 font-mono text-center animate-pulse">
              [!] ERROR: {error}
            </div>
          )}

          <button disabled={loading} type="submit" className="w-full py-4 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-800 text-[#0d1117] font-bold rounded-xl transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-[0.2em]">
            {loading ? <Loader2 className="animate-spin" size={16} /> : "AUTHORIZE_ACCESS"}
          </button>
        </form>
      </div>
    </div>
  );
}