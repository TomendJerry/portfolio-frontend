"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Github, Database, Code2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Definisi tipe data sesuai dengan model di Database
interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  tech_stack: string;
  documentation_url: string | null;
  dataset_url: string | null;
  has_live_demo: boolean;
}

export function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/portfolio/projects`);
        if (!response.ok) throw new Error("Gagal mengambil data");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="projects" className="py-24 bg-[#0d1117] px-6 text-center font-mono text-gray-500">
        <Database className="w-8 h-8 mx-auto mb-4 animate-bounce text-cyan-500" />
        INITIALIZING_PROJECT_SYNC...
      </section>
    );
  }

  return (
    <section id="projects" className="py-24 bg-[#0d1117] px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="font-mono text-3xl md:text-4xl text-white mb-4">
            <span className="text-cyan-400">{"//"}</span> Real-time Projects Database
          </h2>
          <p className="font-sans text-gray-400 max-w-2xl">
            Sistem eksperimen dan produksi yang terhubung langsung ke PostgreSQL Cloud. 
            Data di bawah ini dikelola secara dinamis melalui REST API.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative p-8 bg-gray-900/30 border border-[#30363d] hover:border-emerald-500/50 rounded-lg transition-all duration-300 block"
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                   <span className="font-mono text-[10px] px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 rounded">
                    {project.category.toUpperCase()}
                  </span>
                  <Code2 className="w-4 h-4 text-gray-600 group-hover:text-emerald-500 transition-colors" />
                </div>

                <h3 className="font-mono text-xl text-white mb-4 group-hover:text-emerald-400 transition-colors">
                  {project.title}
                </h3>

                <p className="font-sans text-gray-400 mb-6 leading-relaxed flex-1 text-sm">
                  {project.description}
                </p>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {/* Memisahkan tech_stack yang disimpan sebagai string dipisah koma */}
                    {project.tech_stack?.split(',').map((tag, tagIndex) => (
                      <span 
                        key={tagIndex}
                        className="font-mono text-[10px] px-2 py-1 bg-gray-800/50 text-gray-400 rounded border border-[#30363d]"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#30363d]">
                    <Link 
                      href={`/project/${project.id}`}
                      className="inline-flex items-center gap-2 text-xs text-emerald-400 font-mono hover:gap-3 transition-all"
                    >
                      OPEN_LAB_SYSTEM <ArrowRight className="w-3 h-3" />
                    </Link>
                    
                    <div className="flex gap-3">
                       {project.documentation_url && (
                         <a href={project.documentation_url} target="_blank" className="text-gray-500 hover:text-white transition-colors">
                           <ExternalLink className="w-4 h-4" />
                         </a>
                       )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}