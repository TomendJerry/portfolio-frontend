"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navigation } from "../../../components/Navigation";
import { Github, ExternalLink, ArrowLeft, BarChart,FileText, Database, Loader2, BarChart3 } from "lucide-react";
import Link from "next/link";

interface Metric {
  label: string;
  value: string;
}

interface FlowchartStep {
  step: string;
  title: string;
  desc: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  problem_statement: string | null;
  objective: string | null;
  approach: string | null;
  tech_stack: string | null;
  metrics_json: string | null;
  flowchart_json: string | null;
  documentation_url: string | null;
}

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProjectData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/portfolio/projects/${id}`);
        if (!response.ok) throw new Error("Project not found");
        const data = await response.json();
        setProject(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) getProjectData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center font-mono text-cyan-500">
      <Loader2 className="animate-spin mr-2" /> LOADING_SYSTEM_RECORDS...
    </div>
  );

  if (!project) return <div className="min-h-screen bg-[#0d1117] flex items-center justify-center font-mono text-red-400">ERROR: 404_NOT_FOUND</div>;

  return (
    <main className="min-h-screen bg-[#0d1117] text-white font-sans">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-emerald-400 mb-8 group transition-colors">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-sm uppercase tracking-widest">Back to Lab</span>
        </Link>

        <header className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono mb-6 uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Verified_Project_Report
          </div>
          <h1 className="font-mono text-4xl md:text-6xl mb-6 leading-tight tracking-tighter">
            {project.title}
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl leading-relaxed">
            {project.description}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* KOLOM KIRI: TECHNICAL DETAILS */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* 1. TECHNICAL OVERVIEW */}
            <section className="p-8 bg-gray-900/30 border border-[#30363d] rounded-xl hover:border-cyan-500/30 transition-all group">
              <h2 className="font-mono text-xl mb-6 text-cyan-400 flex items-center gap-3">
                <Database className="w-5 h-5 group-hover:rotate-12 transition-transform" /> {"//"} Technical Overview
              </h2>
              <div className="space-y-8">
                <div>
                  <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em] mb-3">Problem Statement</h4>
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                    {project.problem_statement || "No problem statement provided."}
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em] mb-3">Objective</h4>
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                    {project.objective || "Membangun sistem analisis yang terintegrasi."}
                  </p>
                </div>
              </div>
            </section>

            {/* 2. ARCHITECTURE & APPROACH */}
            <section className="p-8 bg-gray-900/30 border border-[#30363d] rounded-xl hover:border-emerald-500/30 transition-all">
              <h2 className="font-mono text-xl mb-6 text-emerald-400 flex items-center gap-3">
                <BarChart3 className="w-5 h-5" /> {"//"} Architecture & Approach
              </h2>
              <div className="space-y-8">
                <p className="text-gray-300 leading-relaxed text-sm md:text-base whitespace-pre-line">
                  {project.approach || "Detail metodologi belum tersedia."}
                </p>

                {/* --- TARUH KODE FLOWCHART DINAMIS DI SINI --- */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                {(() => {
                  try {
                    const steps = typeof project.flowchart_json === 'string' 
                      ? JSON.parse(project.flowchart_json) 
                      : project.flowchart_json;

                    if (!steps || !Array.isArray(steps)) return null;

                    return steps.map((item: FlowchartStep, idx: number) => (
                      <div key={idx} className="p-4 bg-[#0a0e13] border border-[#30363d] rounded-lg text-center hover:border-emerald-500/50 transition-colors group/step">
                        <span className="block font-mono text-[10px] text-emerald-500 mb-1">{item.step}</span>
                        <h4 className="text-white font-bold text-xs mb-1 uppercase tracking-tight">{item.title}</h4>
                        <p className="text-[9px] text-gray-500 leading-tight">{item.desc}</p>
                      </div>
                    ));
                  } catch (e) {
                    console.error("Error parsing flowchart_json:", e);
                    return null;
                  }
                })()}
              </div>
                {/* --- END OF DYNAMIC FLOWCHART --- */}
              </div>
            </section>
          </div>

          {/* KOLOM KANAN: METRICS & STACK */}
          <aside className="space-y-8">
            {project.metrics_json && (
              <div className="p-6 bg-gray-900/30 border border-[#30363d] rounded-xl shadow-xl shadow-black/20">
                <h3 className="font-mono text-[10px] text-gray-500 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
                  <BarChart className="w-3 h-3" /> Performance Metrics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {(() => {
                    try {
                      const metrics: Metric[] = typeof project.metrics_json === 'string' 
                        ? JSON.parse(project.metrics_json) 
                        : project.metrics_json;

                      return metrics.map((m, i) => (
                        <div key={i} className="p-4 bg-gray-800/30 rounded-lg border border-[#30363d] hover:border-emerald-500/30 transition-colors">
                          <span className="text-[9px] text-gray-500 block mb-1 uppercase tracking-tighter">{m.label}</span>
                          <span className="text-lg font-mono text-emerald-400">{m.value}</span>
                        </div>
                      ));
                    } catch (e) {
                      return <p className="text-[10px] text-red-400 font-mono italic">DATA_FORMAT_ERROR</p>;
                    }
                  })()}
                </div>
              </div>
            )}

            <div className="p-6 bg-gray-900/30 border border-[#30363d] rounded-xl shadow-xl shadow-black/20">
              <h3 className="font-mono text-[10px] text-gray-500 mb-6 uppercase tracking-[0.2em]">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack?.split(',').map((tech: string) => (
                  <span key={tech} className="px-3 py-1 bg-[#0d1117] text-cyan-400 text-[10px] font-mono rounded border border-cyan-400/20 uppercase tracking-wider">
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Link href={`/project/${id}/demo`} className="w-full group">
                <button className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-[#0d1117] font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 uppercase text-xs tracking-[0.1em]">
                  <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" /> Launch Live Demo
                </button>
              </Link>
                {project.documentation_url && (
                <a 
                  href={project.documentation_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <button className="w-full py-4 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-400 font-bold rounded-xl transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-[0.1em] font-mono">
                    <FileText className="w-4 h-4" /> View Technical Report
                  </button>
                </a>
              )}
              <button className="w-full py-4 border border-[#30363d] hover:bg-gray-800/50 text-white rounded-xl transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-[0.1em] font-mono">
                <Github className="w-4 h-4" /> Repository
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}