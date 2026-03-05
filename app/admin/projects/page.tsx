"use client";

import { useEffect, useState } from "react";
import { 
  Plus, Trash2, LayoutDashboard, Globe, Database, 
  Save, Loader2, LogOut, ShieldCheck, Activity, X
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tech_stack: string;
  problem_statement: string | null;
  objective: string | null;
  approach: string | null;
  metrics_json: string | null;
  flowchart_json: string | null;
  documentation_url: string | null;
}

// Interface untuk baris metrik dinamis
interface MetricRow {
  label: string;
  value: string;
}

export default function AdminDashboard() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userSession, setUserSession] = useState<string | null>(null);

  // 1. State untuk baris metrik dinamis
  const [metrics, setMetrics] = useState<MetricRow[]>([{ label: "", value: "" }]);
  const [flowchart, setFlowchart] = useState([{ step: "01", title: "", desc: "" }]);

  const [formData, setFormData] = useState({
    title: "",
    category: "Machine Learning",
    description: "",
    tech_stack: "",
    problem_statement: "",
    objective: "",
    approach: "",
    documentation_url: "",
    has_live_demo: true
  });
  const addFlowRow = () => setFlowchart([...flowchart, { step: `0${flowchart.length + 1}`, title: "", desc: "" }]);
  const removeFlowRow = (index: number) => {
    const newFlow = flowchart.filter((_, i) => i !== index);
    // Pastikan minimal tetap ada 1 baris input
    setFlowchart(newFlow.length ? newFlow : [{ step: "01", title: "", desc: "" }]);
  };
  const updateFlowRow = (index: number, field: string, val: string) => {
    const newFlow = [...flowchart];
    newFlow[index] = { ...newFlow[index], [field]: val };
    setFlowchart(newFlow);
    };

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/portfolio/projects`;

  // Handler untuk Metrik Dinamis
  const addMetricRow = () => setMetrics([...metrics, { label: "", value: "" }]);
  
  const removeMetricRow = (index: number) => {
    const newMetrics = metrics.filter((_, i) => i !== index);
    setMetrics(newMetrics.length ? newMetrics : [{ label: "", value: "" }]);
  };

  const updateMetricRow = (index: number, field: keyof MetricRow, val: string) => {
    const newMetrics = [...metrics];
    newMetrics[index][field] = val;
    setMetrics(newMetrics);
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Gagal sinkronisasi database:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const sessionUser = localStorage.getItem("user_session");
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      setUserSession(sessionUser);
      fetchProjects();
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user_session");
    router.push("/login");
  };

  const handleEditInitiation = (project: Project) => {
    setIsEditing(true);
    setEditId(project.id);
    
    setFormData({
      title: project.title,
      category: project.category,
      description: project.description,
      tech_stack: project.tech_stack || "",
      problem_statement: project.problem_statement || "",
      objective: project.objective || "",
      approach: project.approach || "",
      documentation_url: project.documentation_url || "",
      has_live_demo: true
    });
  
    // 1. Perbaikan Metrik: Cek apakah string atau objek
    if (project.metrics_json) {
      const parsedMetrics = typeof project.metrics_json === 'string' 
        ? JSON.parse(project.metrics_json) 
        : project.metrics_json;
      setMetrics(parsedMetrics);
    } else {
      setMetrics([{ label: "", value: "" }]);
    }
  
    // 2. Perbaikan Flowchart: Cek apakah string atau objek

    if (project.flowchart_json) {
      const parsedFlow = typeof project.flowchart_json === 'string' 
        ? JSON.parse(project.flowchart_json) 
        : project.flowchart_json;
      setFlowchart(parsedFlow);
    } else {
      setFlowchart([{ step: "01", title: "", desc: "" }]);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ 
      title: "", category: "Machine Learning", description: "", 
      tech_stack: "", problem_statement: "", objective: "",
      approach: "", documentation_url: "", has_live_demo: true 
    });
    setMetrics([{ label: "", value: "" }]);
    setFlowchart([{ step: "01", title: "", desc: "" }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    let cleanDocUrl = formData.documentation_url;
    if (cleanDocUrl) {
        // Membersihkan localhost
        cleanDocUrl = cleanDocUrl.replace(/http:\/\/127\.0\.0\.1:8000/gi, "");
        // TAMBAHKAN INI: Membersihkan domain Render (jika ada)
        cleanDocUrl = cleanDocUrl.replace(/https:\/\/portfolio-backend-j9u3\.onrender\.com/gi, "");
    }

    const filteredMetrics = metrics.filter(m => m.label && m.value);
    const finalPayload = { 
        ...formData, 
        documentation_url: cleanDocUrl, // Gunakan URL yang sudah bersih
        metrics_json: filteredMetrics.length ? JSON.stringify(filteredMetrics) : null,
        flowchart_json: flowchart.length ? JSON.stringify(flowchart) : null 
    };

    try {
      const url = isEditing ? `${API_URL}/${editId}` : API_URL;
      const method = isEditing ? "PUT" : "POST";
      const token = localStorage.getItem("access_token"); // Ambil token untuk autentikasi

      const response = await fetch(url, {
        method: method,
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Pastikan ada ini
        },
        body: JSON.stringify(finalPayload),
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "FAILED_TO_SAVE");
      }

      const savedProject = await response.json();

      // LOGIKA UPLOAD FILE (Hanya jika ada file baru yang dipilih)
      if (response.ok && selectedFile) {
        const fileData = new FormData();
        fileData.append("file", selectedFile);
        await fetch(`${API_URL}/${savedProject.id}/upload-doc`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }, // Pastikan ada ini
            body: fileData,
        });
      }

      resetForm();
      setSelectedFile(null);
      fetchProjects();
      alert(isEditing ? "UPDATE_SUCCESSFUL" : "COMMIT_SUCCESSFUL");

    } catch (error: unknown) {
      let errorMessage = "An unexpected error occurred";
      
      // Mengecek apakah error adalah instance dari class Error bawaan JS
      if (error instanceof Error) {
          errorMessage = error.message;
      } 
      // Mengecek jika error dikirim dalam bentuk string manual
      else if (typeof error === "string") {
          errorMessage = error;
      }
  
      alert(`ERROR: ${errorMessage}`);
  } finally {
      setIsSubmitting(false);
  }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Hapus proyek ini secara permanen?")) return;
    try {
      const token = localStorage.getItem("access_token"); // Ambil token login
      const response = await fetch(`${API_URL}/${id}`, { 
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}` // Tambahkan token keamanan
        }
      });
  
      if (response.ok) {
        fetchProjects(); // Refresh tabel setelah berhasil
        alert("PROJECT_DELETED_SUCCESSFULLY");
      } else {
        const errorData = await response.json();
        alert(`ERROR: ${errorData.detail || "UNAUTHORIZED"}`);
      }
    } catch (error) {
      alert("GAGAL_MENGHAPUS_KARENA_MASALAH_JARINGAN");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-300 font-sans p-6 md:p-12 text-sm">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Admin */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-[#30363d] pb-8 gap-4">
          <div>
            <h1 className="text-3xl font-mono text-white flex items-center gap-3 tracking-tighter uppercase">
              <LayoutDashboard className="text-cyan-400" /> PORTFOLIO_CONTROL_CENTER
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <ShieldCheck size={14} className="text-emerald-500" />
              <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">
                Authenticated_as: <span className="text-gray-300">{userSession || "ADMIN"}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs font-mono transition-all flex items-center gap-2 border border-[#30363d]">
              <Globe size={14} /> LIVE_LAB
            </Link>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-mono transition-all border border-red-500/20 flex items-center gap-2">
              <LogOut size={14} /> LOGOUT
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Form Input (Col 5) */}
          <div className="lg:col-span-5">
            <form onSubmit={handleSubmit} className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-6 sticky top-10">
            <div className="flex justify-between items-center mb-2">
            <h2 className={`text-xs font-mono uppercase tracking-widest flex items-center gap-2 ${isEditing ? 'text-cyan-400' : 'text-emerald-400'}`}>
                {isEditing ? <Database size={16} /> : <Plus size={16} />} 
                {isEditing ? `Editing_Record:_${editId?.substring(0, 8)}` : "New_Experiment_Record"}
            </h2>
            
            {isEditing && (
                <button 
                type="button" 
                onClick={resetForm}
                className="text-[10px] font-mono text-red-400 hover:text-white transition-colors flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded border border-red-500/20"
                >
                <X size={12} /> CANCEL_EDIT
                </button>
            )}
            </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-gray-500 mb-1 uppercase">Title</label>
                    <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-xs focus:border-cyan-500 outline-none transition-all" placeholder="Rice Prediction" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-gray-500 mb-1 uppercase">Category</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-xs focus:border-cyan-500 outline-none">
                      <option>Machine Learning</option>
                      <option>Informatika</option>
                      <option>IoT System</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-gray-500 mb-1 uppercase">Subtitle</label>
                  <input required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-xs focus:border-cyan-500 outline-none" placeholder="Short research overview..." />
                </div>

                <div>
                    <label className="block text-[10px] font-mono text-gray-500 mb-1 uppercase">Research Objective</label>
                    <textarea rows={2} value={formData.objective} onChange={e => setFormData({...formData, objective: e.target.value})} className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-xs focus:border-cyan-500 outline-none" placeholder="What is the main goal of this research?" />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-gray-500 mb-1 uppercase">Problem Statement</label>
                  <textarea rows={2} value={formData.problem_statement} onChange={e => setFormData({...formData, problem_statement: e.target.value})} className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-xs focus:border-cyan-500 outline-none" placeholder="Research background..." />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-gray-500 mb-1 uppercase">Approach & Methodology</label>
                  <textarea rows={2} value={formData.approach} onChange={e => setFormData({...formData, approach: e.target.value})} className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-xs focus:border-cyan-500 outline-none" placeholder="CNN-LSTM, Random Forest, etc..." />
                </div>

                {/* 3. SECTION: DYNAMIC METRICS INPUT */}
                <div className="p-4 bg-gray-900/40 rounded-xl border border-[#30363d] space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-mono text-gray-500 uppercase flex items-center gap-2">
                      <Activity size={12} className="text-cyan-400" /> Performance_Metrics
                    </label>
                    <button type="button" onClick={addMetricRow} className="text-[10px] text-cyan-400 hover:text-white font-mono uppercase tracking-tighter">
                      [+] Add_Metric
                    </button>
                  </div>
                  {metrics.map((m, idx) => (
                    <div key={idx} className="flex gap-2 items-center group">
                      <input value={m.label} onChange={e => updateMetricRow(idx, "label", e.target.value)} className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-2 py-1.5 text-[10px] focus:border-cyan-500 outline-none" placeholder="LABEL (e.g. RMSE)" />
                      <input value={m.value} onChange={e => updateMetricRow(idx, "value", e.target.value)} className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-2 py-1.5 text-[10px] focus:border-cyan-500 outline-none" placeholder="VALUE (e.g. 0.04)" />
                      <button type="button" onClick={() => removeMetricRow(idx)} className="p-1 text-gray-600 hover:text-red-400 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* SECTION: DYNAMIC FLOWCHART INPUT */}
                <div className="p-4 bg-gray-900/40 rounded-xl border border-[#30363d] space-y-3">
                <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-mono text-gray-500 uppercase">Architecture_Flowchart</label>
                    <button type="button" onClick={addFlowRow} className="text-[10px] text-cyan-400 font-mono">[+] Add_Step</button>
                </div>
                {flowchart.map((f, idx) => (
                    <div key={idx} className="space-y-2 pb-2 border-b border-[#30363d]/50 last:border-0 group/flow">
                    <div className="flex gap-2 items-center">
                        <input value={f.step} onChange={e => updateFlowRow(idx, "step", e.target.value)} className="w-12 bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-[10px] focus:border-cyan-500 outline-none" placeholder="01" />
                        <input value={f.title} onChange={e => updateFlowRow(idx, "title", e.target.value)} className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-[10px] focus:border-cyan-500 outline-none" placeholder="Title (e.g. Data Input)" />
                        
                        {/* TAMBAHKAN BUTTON INI */}
                        <button 
                        type="button" 
                        onClick={() => removeFlowRow(idx)} 
                        className="p-1 text-gray-600 hover:text-red-400 transition-colors"
                        >
                        <X size={14} />
                        </button>
                    </div>
                    <input value={f.desc} onChange={e => updateFlowRow(idx, "desc", e.target.value)} className="w-full bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-[10px] focus:border-cyan-500 outline-none" placeholder="Description (e.g. Sentinel-2 Acquisition)" />
                    </div>
                ))}
                </div>

                <div>
                <label className="block text-[10px] font-mono text-gray-500 mb-1 uppercase text-cyan-400">
                  Project_Documentation_File (PDF)
                </label>
                
                {/* TAMPILKAN FILE AKTIF DI SINI */}
                {isEditing && formData.documentation_url && (
                  <div className="mb-2 p-2 bg-cyan-500/5 border border-cyan-500/20 rounded flex items-center justify-between">
                    <span className="text-[9px] font-mono text-cyan-400 truncate max-w-[200px]">
                      Current: {formData.documentation_url.split('/').pop()}
                    </span>
                    <a href={formData.documentation_url} target="_blank" className="text-[9px] text-white underline font-mono">View</a>
                  </div>
                )}

                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-[10px] text-gray-400 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-mono file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20" 
                />
              </div>

                <div>
                  <label className="block text-[10px] font-mono text-gray-500 mb-1 uppercase">Tech Stack</label>
                  <input value={formData.tech_stack} onChange={e => setFormData({...formData, tech_stack: e.target.value})} className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-xs focus:border-cyan-500 outline-none" placeholder="FastAPI, TensorFlow, etc" />
                </div>
              </div>

              <button 
                disabled={isSubmitting} 
                type="submit" 
                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] shadow-lg 
                    ${isEditing 
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-gray-900 shadow-cyan-500/20 active:scale-[0.98]' 
                    : 'bg-emerald-500 hover:bg-emerald-400 text-gray-900 shadow-emerald-500/20 active:scale-[0.98]'
                    } 
                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                >
                {isSubmitting ? (
                    <Loader2 className="animate-spin" size={18} />
                ) : (
                    <>
                    {isEditing ? <Database size={18} /> : <Save size={18} />}
                    <span>{isEditing ? "Update_Existing_Record" : "Commit_New_Data"}</span>
                    </>
                )}
                </button>
            </form>
          </div>

          {/* Table (Col 7) */}
          <div className="lg:col-span-7">
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-[#30363d] flex justify-between items-center bg-gray-900/10">
                <h2 className="text-sm font-mono text-cyan-400 flex items-center gap-2 uppercase tracking-tighter">
                  <Database size={16} /> Data_Warehouse_Registry
                </h2>
                <span className="text-[10px] bg-gray-800 px-3 py-1 rounded-full font-mono border border-[#30363d]">{projects.length} RECORDS</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#30363d] bg-gray-900/20">
                      <th className="px-6 py-4 font-mono text-gray-500 uppercase text-[10px]">Registry_Title</th>
                      <th className="px-6 py-4 font-mono text-gray-500 uppercase text-[10px]">Classification</th>
                      <th className="px-6 py-4 font-mono text-gray-500 uppercase text-[10px] text-right">Operation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map(p => (
                      <tr key={p.id} className="border-b border-[#30363d]/50 hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                        <div className="font-bold text-white tracking-tight leading-none mb-1">{p.title}</div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-mono text-gray-600 bg-gray-800/50 px-1 rounded uppercase">
                            ID: {p.id.substring(0, 8)}...
                            </span>
                        </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[9px] px-2 py-0.5 bg-gray-800 rounded border border-[#30363d] font-mono text-cyan-400 uppercase tracking-tighter">{p.category}</span>
                        </td>
                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button onClick={() => handleEditInitiation(p)} className="text-gray-600 hover:text-cyan-400 transition-colors p-2 rounded-md hover:bg-cyan-400/10">
                            <Database size={16} />
                        </button>
                        <button onClick={() => deleteProject(p.id)} className="text-gray-600 hover:text-red-400 transition-colors p-2 rounded-md hover:bg-red-400/10">
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
      </div>
    </div>
  );
}