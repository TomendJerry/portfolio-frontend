"use client";

import { useState } from "react";
import { ArrowLeft, Shovel, Info, Layers } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function MappingLab() {
  const params = useParams();
  const id = params?.id as string;

  // State untuk input 12 Band Sentinel-2 sesuai skripsi Saifudin Nasir
  const [bands, setBands] = useState({
    B1: 1200, B2: 1500, B3: 1800, B4: 2000,
    B5: 2200, B6: 2500, B7: 2800, B8: 3000,
    B8A: 3200, B9: 1000, B11: 1500, B12: 1200
  });

  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBands({ ...bands, [e.target.name]: parseFloat(e.target.value) });
  };

  const runClassification = async () => {
    setLoading(true);
    setPrediction(null);
    try {
      // PERBAIKAN: Tambahkan '/mangrove' pada URL agar sesuai dengan prefix Backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/mangrove/predict/mapping`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        // Pastikan 'bands' berisi keys kapital (B1, B2, dst) sesuai state Anda
        body: JSON.stringify(bands),
      });

      // Jika error, kita ambil pesan detail dari FastAPI untuk debugging
      if (!response.ok) {
        const errorDetail = await response.json();
        console.error("Detail Error dari Server:", errorDetail);
        throw new Error("Server Response Error");
      }

      const data = await response.json();
      setPrediction(data.class);
    } catch (error) {
      console.error("Gagal klasifikasi:", error);
      // Menampilkan pesan error yang lebih informatif di UI
      setPrediction("CONNECTION_ERROR");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Gunakan min-h-screen agar background selalu penuh, dan biarkan halaman bisa di-scroll secara alami
    <div className="min-h-screen bg-[#0d1117] text-white p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto pb-20"> {/* Tambahkan padding bawah (pb-20) agar tombol tidak mepet bawah */}
        {/* Navigation */}
        <Link href={`/project/${id}/demo`} className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-8 group font-mono text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          BACK_TO_LAB_HUB
        </Link>

        <header className="mb-12">
          <h1 className="text-3xl font-mono text-cyan-400 mb-2 flex items-center gap-3">
            <Layers className="w-8 h-8" /> LAND_COVER_CLASSIFIER_V1
          </h1>
          <p className="text-gray-400 max-w-2xl text-sm">
            Modul klasifikasi tutupan lahan di wilayah Muara Gembong menggunakan citra Sentinel-2.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Input Panel */}
          {/* Hapus max-h agar panel memanjang mengikuti jumlah input, sehingga tombol pasti terlihat di bawahnya */}
          <div className="lg:col-span-2 bg-gray-900/40 border border-[#30363d] rounded-2xl p-6 md:p-8">
            <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Info className="w-4 h-4" /> Satellite Band Input (Reflectance)
            </h3>
            
            {/* Grid Input */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Object.keys(bands).map((band) => (
                <div key={band} className="space-y-2">
                  <label className="block text-[10px] font-mono text-cyan-500/70">{band}</label>
                  <input
                    type="number"
                    name={band}
                    step="0.0001"
                    value={bands[band as keyof typeof bands]}
                    onChange={handleInputChange}
                    className="w-full bg-[#0a0e13] border border-[#30363d] rounded-md px-3 py-2 text-sm focus:border-cyan-500/50 outline-none transition-all"
                  />
                </div>
              ))}
            </div>

            {/* Tombol Klasifikasi - Ditaruh tepat di bawah grid input */}
            <button
              onClick={runClassification}
              disabled={loading}
              className="w-full mt-10 py-4 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-700 text-[#0d1117] font-bold rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm shadow-lg shadow-cyan-500/10"
            >
              {loading ? "PROCESSING..." : "RUN_CLASSIFICATION_MODEL"}
            </button>
          </div>

          {/* Result Panel */}
          {/* Gunakan sticky agar hasil prediksi tetap terlihat saat Anda scroll input yang banyak di kiri */}
          <div className="lg:sticky lg:top-32 space-y-6">
            <div className="bg-[#0a0e13] border border-[#30363d] rounded-2xl p-8 flex flex-col justify-center items-center text-center min-h-[300px]">
              <span className="text-xs font-mono text-gray-500 mb-6 uppercase tracking-widest">Classification Result</span>
              
              {prediction ? (
                <div className="animate-in fade-in zoom-in duration-500">
                  <div className={`text-5xl font-mono font-bold mb-4 ${
                    prediction === 'Mangrove' ? 'text-emerald-400' : 
                    prediction === 'Air' ? 'text-blue-400' : 'text-orange-400'
                  }`}>
                    {prediction.toUpperCase()}
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono bg-gray-900 px-3 py-1 rounded-full border border-[#30363d]">
                    PROCESSED_BY_RF_MODEL
                  </div>
                </div>
              ) : (
                <div className="text-gray-700 flex flex-col items-center gap-4">
                  <Shovel className="w-12 h-12 opacity-10" />
                  <p className="text-xs font-mono uppercase tracking-widest">Awaiting Parameters</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Technical Footer */}
        <footer className="mt-20 p-6 border-t border-[#30363d]/50 flex flex-wrap gap-8 justify-center opacity-40">
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-mono text-gray-500">MODEL:</span>
             <span className="text-[10px] font-mono text-white tracking-widest uppercase">RANDOM_FOREST_V2.0</span>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-mono text-gray-500">ENGINE:</span>
             <span className="text-[10px] font-mono text-white tracking-widest uppercase">SCIKIT_LEARN_PY</span>
          </div>
        </footer>
      </div>
    </div>
  );
}