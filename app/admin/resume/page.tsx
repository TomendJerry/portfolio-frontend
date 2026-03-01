"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, CheckCircle2, Eye, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

interface Resume {
  id: number;
  resume_name: string;
  full_name: string;
  is_active: boolean;
  updated_at: string;
}

export default function ResumeListPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fetchResumes = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/resume/`);
      if (res.ok) {
        const data = await res.json();
        setResumes(data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }, []);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/resume/`);
        if (res.ok) {
          const data = await res.json();
          setResumes(data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
  
    fetchResumes();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/resume/upload`, {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      alert("PDF Berhasil diunggah!");
      fetchResumes();
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Hapus resume ini?")) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/resume/${id}`, { method: "DELETE" });
      if (res.ok) {
        // PENTING: Refresh data agar kartu hilang dari layar
        fetchResumes(); 
      }
    }
  };

  const handleActivate = async (id: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/resume/${id}/activate`, { method: "PATCH" });
      if (res.ok) {
        // PENTING: Refresh data agar tanda centang hijau berpindah
        fetchResumes(); 
      }
    } catch (err) {
      console.error("Failed to activate resume:", err);
    }
  };

  return (
    <div className="p-8 bg-[#0d1117] min-h-screen text-white space-y-6">
      <div className="flex justify-between items-center border-b border-[#30363d] pb-4">
        <h1 className="text-2xl font-mono italic">{"//"} RESUME_MANAGEMENT</h1>
        <div className="flex gap-3">
        {/* Input file yang disembunyikan */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleUpload} 
          className="hidden" 
          accept=".pdf" 
        />
        
        {/* Tombol pemicu upload */}
        <Button 
          onClick={() => fileInputRef.current?.click()} 
          variant="outline" 
          className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/10"
        >
          <Upload className="mr-2 h-4 w-4" /> Upload PDF
        </Button>

        <Button onClick={() => router.push("/admin/resume/new")} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" /> Create New
        </Button>
      </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resumes.map((r) => (
          <Card key={r.id} className={`bg-[#161b22] border-[#30363d] transition-all duration-300 ${r.is_active ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : ''}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
              <CardTitle className="text-emerald-400 font-mono text-lg truncate pr-4">
                {r.resume_name} 
                {/* Tambahkan label jika ini adalah file upload */}
                {r.full_name === "Uploaded PDF" && <span className="text-[10px] ml-2 text-gray-500">(FILE)</span>}
              </CardTitle>
                {r.is_active && <CheckCircle2 className="text-emerald-500 h-5 w-5 shrink-0" />}
              </div>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                UPDATED: {new Date(r.updated_at).toLocaleString()}
              </p>
            </CardHeader>
            {/* CardContent yang diperbaiki */}
            <CardContent className="space-y-4 pt-4">
              {/* Baris Utama Tombol Aksi */}
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => router.push(`/admin/resume/${r.id}`)} 
                  className="flex-1 min-w-[70px] border-[#30363d] hover:bg-gray-800 text-[10px] h-8"
                >
                  <Edit size={12} className="mr-1" /> EDIT
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/resume/generate/${r.id}?preview=true`, "_blank")} 
                  className="flex-1 min-w-[70px] border-[#30363d] hover:bg-emerald-500/10 text-emerald-500 text-[10px] h-8"
                >
                  <Eye size={12} className="mr-1" /> VIEW
                </Button>

                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleActivate(r.id)} 
                  className={`flex-1 min-w-[80px] h-8 ${
                    r.is_active 
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-500" 
                      : "border-[#30363d] text-gray-400"
                  }`}
                >
                  <span className="text-[9px] uppercase font-bold">
                    {r.is_active ? "ACTIVE" : "ACTIVATE"}
                  </span>
                </Button>
              </div>

              {/* Baris Terpisah untuk Tombol Hapus agar tidak menumpuk */}
              <div className="pt-2 border-t border-[#30363d]/50 flex justify-end">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handleDelete(r.id)} 
                  className="text-red-500 hover:bg-red-500/10 h-8 px-3 text-[10px] gap-2"
                >
                  <Trash2 size={14}/>
                  <span>DELETE_RECORD</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}