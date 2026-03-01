"use client";

import Link from "next/link";
import { Map, Zap, ArrowRight, ArrowLeft } from "lucide-react";

export default function MangroveHub({ projectId }: { projectId: string | string[] | undefined }) {
  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-6 text-white font-sans">
      <div className="max-w-4xl w-full">
        <Link 
          href={`/project/${projectId}`} 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-emerald-400 mb-8 font-mono text-xs uppercase"
        >
          <ArrowLeft className="w-4 h-4" /> Back_to_Project_Detail
        </Link>

        <header className="mb-12 text-center">
          <h1 className="font-mono text-3xl text-emerald-400 mb-2">{"//"} MANGROVE INTELLIGENCE LAB</h1>
          <p className="text-gray-400">Pilih modul laboratorium hasil riset Saifudin Nasir</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href={`/project/${projectId}/demo/skripsi/Pemetaan`} className="group">
            <div className="p-8 bg-gray-900/40 border border-[#30363d] rounded-2xl hover:border-cyan-500/50 transition-all">
              <Map className="w-12 h-12 text-cyan-400 mb-6" />
              <h2 className="text-2xl font-bold mb-3">Land Cover Mapping</h2>
              <p className="text-gray-400 text-sm mb-6">Klasifikasi tutupan lahan menggunakan Sentinel-2 dan Random Forest Classifier.</p>
              <div className="flex items-center text-cyan-400 font-mono text-xs gap-2">Launch Classifier <ArrowRight className="w-4 h-4" /></div>
            </div>
          </Link>

          <Link href={`/project/${projectId}/demo/skripsi/Prediksi`} className="group">
            <div className="p-8 bg-gray-900/40 border border-[#30363d] rounded-2xl hover:border-emerald-500/50 transition-all">
              <Zap className="w-12 h-12 text-emerald-400 mb-6" />
              <h2 className="text-2xl font-bold mb-3">Carbon Estimator</h2>
              <p className="text-gray-400 text-sm mb-6">Estimasi stok karbon (AGC) dan biomassa (AGB) menggunakan Random Forest Regressor.</p>
              <div className="flex items-center text-emerald-400 font-mono text-xs gap-2">Launch Regressor <ArrowRight className="w-4 h-4" /></div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}