"use client";

import { useState } from "react";
import { ArrowLeft, Zap, TreeDeciduous, Activity } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PredictionLab() {
  const params = useParams();
  const id = params?.id as string;

  const [inputs, setInputs] = useState({
    ndvi: 0.65,
    evi: 0.45,
    species_code: 0
  });

  const [results, setResults] = useState<{agb: number, agc: number, dbh: number} | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mapping spesies sesuai daftar yang ada di skripsi Anda
  const speciesMap = [
    "Avicennia marina", "Rhizophora apiculata", "Lumnitzera racemosa",
    "Rhizophora stylosa", "Aegiceras corniculatum", "Ceriops tagal"
  ];

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      // PERBAIKAN 1: URL disesuaikan dengan prefix /api/v1/mangrove
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/mangrove/predict/carbon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Validation Error:", data.detail);
        throw new Error(data.detail?.[0]?.msg || "Server Error");
      }

      // PERBAIKAN 2: Mapping key sesuai dengan respons 'results' dari mangrove.py
      // Backend mengirim: results: { agb_kg, agc_kg, dbh_cm }
      setResults({ 
        agb: data.results.agb_kg, 
        agc: data.results.agc_kg, 
        dbh: data.results.dbh_cm 
      });

    } catch (err: unknown) {
      console.error("Error:", err);
    
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to connect to model server");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <Link href={`/project/${id}/demo`} className="inline-flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors mb-8 group font-mono text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          BACK_TO_LAB_HUB
        </Link>

        <header className="mb-12">
          <h1 className="text-3xl font-mono text-emerald-400 mb-2 flex items-center gap-3">
            <Zap className="w-8 h-8" /> CARBON_ESTIMATOR_V1
          </h1>
          <p className="text-gray-400 max-w-2xl text-sm italic">
            Estimasi stok karbon (AGC) dan biomassa (AGB) berdasarkan riset di wilayah Muara Gembong.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-2 bg-gray-900/40 border border-[#30363d] rounded-2xl p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest">Vegetation Index (NDVI)</label>
                <input type="range" min="0" max="1" step="0.01" value={inputs.ndvi} 
                  onChange={(e) => setInputs({...inputs, ndvi: parseFloat(e.target.value)})}
                  className="w-full accent-emerald-500 cursor-pointer" />
                <div className="flex justify-between text-[10px] font-mono text-emerald-500">
                  <span>0.0</span><span>VAL: {inputs.ndvi}</span><span>1.0</span>
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest">Enhanced Index (EVI)</label>
                <input type="range" min="0" max="1" step="0.01" value={inputs.evi} 
                  onChange={(e) => setInputs({...inputs, evi: parseFloat(e.target.value)})}
                  className="w-full accent-emerald-500 cursor-pointer" />
                <div className="flex justify-between text-[10px] font-mono text-emerald-500">
                  <span>0.0</span><span>VAL: {inputs.evi}</span><span>1.0</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#30363d]">
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest">Dominant Species Selection</label>
              <select 
                value={inputs.species_code}
                onChange={(e) => setInputs({...inputs, species_code: parseInt(e.target.value)})}
                className="w-full bg-[#0a0e13] border border-[#30363d] rounded-lg px-4 py-3 text-sm outline-none focus:border-emerald-500/50 appearance-none transition-all"
              >
                {speciesMap.map((name, idx) => (
                  <option key={idx} value={idx}>{name}</option>
                ))}
              </select>
            </div>

            <button onClick={handlePredict} disabled={loading}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-[#0d1117] font-bold rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
            >
              <Activity className="w-4 h-4" /> {loading ? "CALCULATING..." : "RUN ESTIMATION MODEL"}
            </button>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-mono">
                ERROR: {error}
              </div>
            )}
          </div>

          {/* Result Panel */}
          <div className="space-y-6">
            <div className="bg-[#0a0e13] border border-[#30363d] rounded-2xl p-8 flex flex-col justify-center items-center text-center h-full min-h-[400px]">
              {results ? (
                <div className="space-y-10 w-full animate-in fade-in zoom-in duration-500">
                  <div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Biomassa (AGB)</span>
                    <div className="text-5xl font-mono font-bold text-white">{results.agb} <span className="text-sm text-emerald-500">kg</span></div>
                  </div>
                  <div className="pt-10 border-t border-[#30363d]">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Stok Karbon (AGC)</span>
                    <div className="text-5xl font-mono font-bold text-emerald-400">{results.agc} <span className="text-sm text-white">kg</span></div>
                  </div>
                  <div className="pt-10 border-t border-[#30363d]">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Est. Diameter (DBH)</span>
                    <div className="text-2xl font-mono text-gray-300">{results.dbh} <span className="text-xs">cm</span></div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-600 flex flex-col items-center gap-4">
                  <TreeDeciduous className="w-12 h-12 opacity-20" />
                  <p className="text-xs font-mono italic">Adjust parameters to see results</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}