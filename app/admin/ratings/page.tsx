"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState, useCallback } from "react";
import { Star, Trash2 } from "lucide-react";

interface RatingData {
  id: number;
  score: number;
  comment: string | null;
  category: string;
  user_ip: string;
  created_at: string;
}

export default function AdminRatingsPage() {
  const { user } = useAuth();
  const [ratings, setRatings] = useState<RatingData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 1. TAMBAHKAN STATE MOUNTED UNTUK MENCEGAH HYDRATION ERROR
  const [isMounted, setIsMounted] = useState(false);

  const loadRatings = useCallback(async () => {
    // Normalisasi pengecekan role agar sinkron dengan backend
    const currentRole = user?.role?.toLowerCase().replace(/\s+/g, '_');
    if (!currentRole) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/rating/admin/all?role=${currentRole}`);
      if (res.ok) {
        const data: RatingData[] = await res.json();
        setRatings(data);
      }
    } catch (error) {
      console.error("Gagal mengambil data rating:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.role]);

  // 2. SET MOUNTED KE TRUE SETELAH KOMPONEN MASUK KE BROWSER
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && user) {
      loadRatings();
    }
  }, [isMounted, user, loadRatings]);

  const handleDelete = async (id: number) => {
    const currentRole = user?.role?.toLowerCase().replace(/\s+/g, '_');
    if (confirm("Hapus feedback ini?")) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/rating/admin/${id}?role=${currentRole}`, { 
        method: 'DELETE' 
      });
      if (res.ok) {
        loadRatings();
      }
    }
  };

  // 3. JANGAN RENDER APAPUN SEBELUM MOUNTED UNTUK MENGHINDARI MISMATCH
  if (!isMounted) {
    return <div className="p-8 bg-[#0d1117] min-h-screen" />; 
  }

  if (!user) {
    return <div className="p-20 text-center text-gray-500 font-mono bg-[#0d1117] min-h-screen">LOADING_AUTH_SESSION...</div>;
  }

  const currentRole = user?.role?.toLowerCase().replace(/\s+/g, '_');
  if (currentRole !== "admin" && currentRole !== "super_admin") {
    return <div className="p-20 text-center text-red-500 font-mono bg-[#0d1117] min-h-screen">ACCESS_DENIED: UNAUTHORIZED_ROLE</div>;
  }

  return (
    <div className="p-8 bg-[#0d1117] min-h-screen text-white">
      <h1 className="text-2xl font-mono mb-8 italic">{"//"} MANAGE_USER_FEEDBACK</h1>
      
      {loading ? (
         <div className="text-center p-10 text-emerald-400 font-mono italic">FETCHING_DATABASE_RECORDS...</div>
      ) : (
        <div className="overflow-x-auto border border-[#30363d] rounded-xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#161b22] text-emerald-400 font-mono">
              <tr>
                <th className="p-4">Score</th>
                <th className="p-4">Comment</th>
                <th className="p-4">User IP</th>
                <th className="p-4">Date</th>
                {currentRole === "super_admin" && <th className="p-4 text-center">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363d]">
              {ratings.map((r) => (
                <tr key={r.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="p-4 flex gap-1">
                    {[...Array(r.score)].map((_, i) => (
                      <Star key={i} size={14} className="fill-yellow-500 text-yellow-500" />
                    ))}
                  </td>
                  <td className="p-4 text-gray-400 italic max-w-xs truncate">{r.comment || "-"}</td>
                  <td className="p-4 font-mono text-cyan-500 text-xs">{r.user_ip}</td>
                  <td className="p-4 text-gray-500 text-xs">{new Date(r.created_at).toLocaleString()}</td>
                  {currentRole === "super_admin" && (
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleDelete(r.id)} 
                        className="text-red-500 hover:scale-110 transition-transform"
                      >
                        <Trash2 size={16}/>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}