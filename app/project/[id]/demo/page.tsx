"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
// Import komponen spesifik Anda
import RiceDashboard from "@/components/demos/penelitian/RiceDashboard";
import MangroveHub from "@/components/demos/skripsi/MangroveAnalytics"; 

interface ProjectData {
  category: string;
  // Anda bisa menambah field lain jika perlu
}

export default function DemoPage() {
  const params = useParams();
  const id = params?.id as string;
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectCategory = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/portfolio/projects/${id}`);
        const data = await response.json();
        setProject(data);
      } catch (err) {
        console.error("Gagal memvalidasi kategori proyek:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProjectCategory();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center font-mono text-cyan-500">
      <Loader2 className="animate-spin mr-2" /> INITIALIZING_DEMO_ENVIRONMENT...
    </div>
  );

  if (!project) return <div className="text-white text-center pt-20">PROJECT_NOT_FOUND</div>;

  // LOGIKA STANDAR INDUSTRI: Switcher Berdasarkan Kategori
  switch (project.category) {
    case "Informatika":
      return <RiceDashboard projectId={id} />;
    case "Machine Learning":
      // Kode lama Anda kita pindahkan ke dalam komponen MangroveAnalytics.tsx
      return <MangroveHub projectId={id} />;
    default:
      return (
        <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-white font-mono">
          ERROR: NO_DEMO_MODULE_FOR_CATEGORY_{project.category.toUpperCase()}
        </div>
      );
  }
}