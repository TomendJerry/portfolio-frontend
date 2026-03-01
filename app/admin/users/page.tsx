"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { 
  Users, UserPlus, Trash2, ShieldAlert, 
  Loader2, RefreshCw, Edit, ShieldCheck 
} from "lucide-react";

interface UserAccount {
  id: number;
  username: string;
  full_name: string;
  role: string;
}

export default function ManageUsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [adminList, setAdminList] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    password: "",
    role: "admin"
  });

  const API_USER_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`;

  // 1. Proteksi Halaman: Jika bukan super_admin, tendang ke dashboard utama
  useEffect(() => {
    if (user && user.role !== "super_admin") {
      alert("Akses Ditolak! Anda bukan Super Admin.");
      router.push("/admin");
    } else {
      fetchAdmins();
    }
  }, [user, router]);

  const fetchAdmins = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(API_USER_URL, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAdminList(data);
      }
    } catch (error) {
      console.error("Gagal mengambil data admin:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(API_USER_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormData({ username: "", full_name: "", password: "", role: "admin" });
        fetchAdmins();
        alert("Admin Baru Berhasil Ditambahkan!");
      } else {
        const err = await response.json();
        alert(`Gagal: ${err.detail}`);
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: number, username: string) => {
    if (username === user?.username) return alert("Anda tidak bisa menghapus akun sendiri!");
    if (!confirm(`Hapus admin ${username}?`)) return;

    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${API_USER_URL}/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) fetchAdmins();
    } catch (error) {
      alert("Gagal menghapus user.");
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-cyan-400" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b border-[#30363d] pb-6">
        <div>
          <h1 className="text-2xl font-mono text-white flex items-center gap-3 uppercase tracking-tighter">
            <Users className="text-cyan-400" /> Admin_Registry_Management
          </h1>
          <p className="text-xs text-gray-500 font-mono mt-1">SUPER_ADMIN_PRIVILEGE_ACTIVE</p>
        </div>
        <button onClick={fetchAdmins} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400">
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Tambah User */}
        <div className="lg:col-span-4">
          <form onSubmit={handleCreateUser} className="bg-[#161b22] border border-[#30363d] p-6 rounded-2xl space-y-4">
            <h2 className="text-xs font-mono text-emerald-400 uppercase flex items-center gap-2 mb-4">
              <UserPlus size={14} /> Register_New_Access
            </h2>
            
            <div className="space-y-3">
              <input 
                required
                placeholder="Username" 
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-cyan-500"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
              <input 
                required
                placeholder="Full Name" 
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-cyan-500"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              />
              <input 
                required
                type="password"
                placeholder="Password" 
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-cyan-500"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <select 
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-xs text-white outline-none"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="admin">Admin (Content Only)</option>
                <option value="super_admin">Super Admin (Full Access)</option>
              </select>
            </div>

            <button 
              disabled={isSubmitting}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-gray-900 py-2 rounded-lg text-xs font-bold transition-all flex justify-center items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <ShieldCheck size={14} />}
              AUTHORIZE_ACCESS
            </button>
          </form>
        </div>

        {/* Tabel List User */}
        <div className="lg:col-span-8">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-900/50 text-gray-500 font-mono uppercase text-[10px]">
                <tr>
                  <th className="px-6 py-4">User_Identity</th>
                  <th className="px-6 py-4">Security_Role</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363d]">
                {adminList.map((adm) => (
                  <tr key={adm.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-white font-bold">{adm.full_name}</div>
                      <div className="text-[10px] text-gray-500 font-mono">@{adm.username}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[9px] font-mono uppercase ${
                        adm.role === 'super_admin' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-gray-800 text-gray-400 border border-gray-700'
                      }`}>
                        {adm.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeleteUser(adm.id, adm.username)}
                        className="text-gray-500 hover:text-red-400 transition-colors p-2"
                        title="Hapus Akses"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}