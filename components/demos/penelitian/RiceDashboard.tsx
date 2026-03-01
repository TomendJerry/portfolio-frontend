"use client";
import { RiceAPI } from "@/lib/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, RefreshCw, TrendingUp, Box, Activity,
  Loader2, BarChart3, Map as MapIcon, Info
} from "lucide-react";
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend,
   Filler
 } from "chart.js";
 
import { Line } from 'react-chartjs-2';
import dynamic from "next/dynamic";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const RiceMap = dynamic(() => import("./RiceMap"), { 
  ssr: false, 
  loading: () => <div className="h-[400px] bg-[#0d1117] flex items-center justify-center font-mono text-emerald-400">LOADING_MAP...</div>
});

const DIVRE_REGIONS = [
  "Nanggroe Aceh Darussalam", "Sumatera Utara", "Sumatera Barat", "Riau",
  "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Sulawesi Selatan"
];

// 1. Definisikan tipe SegmentContext agar dikenali oleh segment Chart.js
import type {
   ChartData,
   ScriptableLineSegmentContext
 } from "chart.js";
 
interface HistoryDataResponse {
  tahun: number;
  produksi: number | null;
  demand: number | null;
  type?: "history" | "prediction";
}

export default function RiceDashboard({ projectId }: { projectId: string }) {
  const [provinsi, setProvinsi] = useState("Nanggroe Aceh Darussalam");
  const [inputYear, setInputYear] = useState(2025);
  const [activeTab, setActiveTab] = useState<"production" | "demand">("production");
  const [chartData, setChartData] = useState<ChartData<"line", (number | null)[], number> | null>(null);
  const [prodGabah, setProdGabah] = useState<number | null>(null);
  const [prodBeras, setProdBeras] = useState<number | null>(null);
  const [demResult, setDemResult] = useState<number | null>(null);
  
  const [loadingProd, setLoadingProd] = useState(false);
  const [loadingDem, setLoadingDem] = useState(false);
  const [loadingBaseline, setLoadingBaseline] = useState(false);

  // States Produksi
  const [luasPanen, setLuasPanen] = useState<number | "">("");
  const [produktivitas, setProduktivitas] = useState<number | "">("");
  const [suhuMin, setSuhuMin] = useState<number | "">("");
  const [suhuRata, setSuhuRata] = useState<number | "">("");
  const [suhuMaks, setSuhuMaks] = useState<number | "">("");
  const [kelembapan, setKelembapan] = useState<number | "">("");
  const [curahHujan, setCurahHujan] = useState<number | "">("");
  const [hariHujan, setHariHujan] = useState<number | "">("");
  const [angin, setAngin] = useState<number | "">("");
  const [tekanan, setTekanan] = useState<number | "">("");
  const [sinar, setSinar] = useState<number | "">("");
  const [soi, setSoi] = useState<number | "">("");
  const [dmi, setDmi] = useState<number | "">("");
  const [soiLabel, setSoiLabel] = useState<string>("Netral"); // 🔴 TAMBAHAN SOI LABEL

  // States Demand
  const [populasi, setPopulasi] = useState<number | "">("");
  const [pertumbuhan, setPertumbuhan] = useState<number | "">("");
  const [hargaBeras, setHargaBeras] = useState<number | "">("");
  const [hargaJagung, setHargaJagung] = useState<number | "">("");
  const [hargaMi, setHargaMi] = useState<number | "">("");
  const [kemiskinan, setKemiskinan] = useState<number | "">("");
  const [garisKemiskinan, setGarisKemiskinan] = useState<number | "">("");
  const [pdrb, setPdrb] = useState<number | "">("");
  const [gini, setGini] = useState<number | "">("");
  const [rt, setRt] = useState<number | "">("");
  const [pengangguran, setPengangguran] = useState<number | "">("");

  const safeNum = (val: number | "") => (val === "" || isNaN(Number(val)) ? null : Number(val));

  const formatTon = (val: number | null) => {
    if (val === null) return "-";
    return val.toLocaleString('id-ID', { maximumFractionDigits: 0 });
  };

// LOKASI: Frontend/components/demos/penelitian/RiceDashboard.tsx

const fetchHistoryAndUpdateChart = () => {
  RiceAPI.getChartData(provinsi)
    .then((rawData: HistoryDataResponse[]) => {
      if (!rawData || rawData.length === 0) return;

      // 1️⃣ DEDUPLIKASI: Gabungkan data jika ada tahun yang sama (mencegah duplikat 2026)
      const mergedDataMap = new Map<number, HistoryDataResponse>();
      rawData.forEach(item => {
        const existing = mergedDataMap.get(item.tahun);
        // Prioritaskan data 'prediction' jika sedang melakukan simulasi, atau 'history' jika sudah ada
        if (!existing || item.type === "prediction") {
          mergedDataMap.set(item.tahun, item);
        }
      });

      // 2️⃣ Urutkan data berdasarkan tahun agar label X-Axis sinkron
      const sortedData = Array.from(mergedDataMap.values()).sort((a, b) => a.tahun - b.tahun);

      // 3️⃣ Buat label tunggal untuk sumbu X
      const labels = sortedData.map(d => d.tahun);

      setChartData({
        labels,
        datasets: [
          // ================= PRODUKSI =================
          {
            label: "Production Beras (Ton)",
            data: sortedData.map(d => d.produksi),
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            fill: true,
            tension: 0.4,
            spanGaps: true, // Menghubungkan garis jika ada data null di tengah
            segment: {
              // Garis otomatis putus-putus jika titik tujuan adalah data prediksi
              borderDash: (ctx: ScriptableLineSegmentContext) =>
                sortedData[ctx.p1DataIndex]?.type === "prediction" ? [5, 5] : undefined,
            },
          },
          // ================= DEMAND =================
          {
            label: "Demand (Ton)",
            data: sortedData.map(d => d.demand),
            borderColor: "#06b6d4",
            tension: 0.4,
            spanGaps: true,
            segment: {
              borderDash: (ctx: ScriptableLineSegmentContext) =>
                sortedData[ctx.p1DataIndex]?.type === "prediction" ? [5, 5] : undefined,
            },
          },
        ],
      });
    })
    .catch(err => console.error("Chart Sync Error:", err));
};

  useEffect(() => {
    setProdGabah(null);
    setProdBeras(null);
    setDemResult(null);
    setLoadingBaseline(true);
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/rice/baseline/${provinsi}`)
    .then(res => res.json())
    .then(data => {
        const p = data.production || {};
        const d = data.demand || {};
        
        setLuasPanen(p.luas_panen ?? ""); setProduktivitas(p.produktivitas ?? "");
        setSuhuMin(p.suhu_min ?? ""); setSuhuRata(p.suhu_rata ?? ""); setSuhuMaks(p.suhu_maks ?? "");
        setKelembapan(p.kelembapan ?? ""); setCurahHujan(p.curah_hujan ?? ""); setHariHujan(p.hari_hujan ?? "");
        setAngin(p.kecepatan_angin ?? ""); setTekanan(p.tekanan_udara ?? ""); setSinar(p.penyinaran ?? "");
        setSoi(p.soi_bom ?? ""); setDmi(p.dmi ?? ""); 
        setSoiLabel(p.soi_label ?? "Netral");

        setPopulasi(d.populasi ?? ""); setPertumbuhan(d.pertumbuhan_pop ?? "");
        setHargaBeras(d.harga_beras ?? ""); setHargaJagung(d.harga_jagung ?? "");
        setHargaMi(d.harga_mi ?? ""); setKemiskinan(d.kemiskinan ?? "");
        setGarisKemiskinan(d.garis_kemiskinan ?? ""); setPdrb(d.pdrb ?? "");
        setGini(d.gini ?? ""); setRt(d.ukuran_rt ?? ""); setPengangguran(d.pengangguran ?? "");
      })
      .finally(() => {
        setLoadingBaseline(false);
        fetchHistoryAndUpdateChart();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provinsi, inputYear]);

  const handlePredictProduction = async () => {
    setLoadingProd(true);
    try {
      const payload = { 
        tahun: inputYear, provinsi, 
        luas_panen: safeNum(luasPanen), produktivitas: safeNum(produktivitas),
        suhu_min: safeNum(suhuMin), suhu_rata: safeNum(suhuRata), suhu_maks: safeNum(suhuMaks),
        kelembapan: safeNum(kelembapan), curah_hujan: safeNum(curahHujan), hari_hujan: safeNum(hariHujan),
        kecepatan_angin: safeNum(angin), tekanan_udara: safeNum(tekanan), penyinaran: safeNum(sinar),
        annual_soi_bom: safeNum(soi), soi_label: soiLabel, annual_dmi: safeNum(dmi) // MASUKKAN SOI LABEL
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/rice/predict/production`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
      });
      if(!res.ok) throw new Error("API Error");
      
      const data = await res.json();
      setProdGabah(data.production_gabah);
      setProdBeras(data.production_beras);
      fetchHistoryAndUpdateChart();
      setActiveTab("demand"); 
    } catch (err) { alert("Gagal memprediksi produksi. Pastikan backend aktif."); } 
    finally { setLoadingProd(false); }
  };

  const handlePredictDemand = async () => {
   if (prodGabah === null) return alert("Jalankan Prediksi Produksi terlebih dahulu!");
   setLoadingDem(true);
   try {
     const payload = {
        tahun: inputYear, provinsi, 
        populasi: safeNum(populasi), pertumbuhan_pop: safeNum(pertumbuhan), harga_beras: safeNum(hargaBeras),
        harga_jagung: safeNum(hargaJagung), harga_mi: safeNum(hargaMi), kemiskinan: safeNum(kemiskinan),
        garis_kemiskinan: safeNum(garisKemiskinan), pdrb: safeNum(pdrb), gini: safeNum(gini),
        ukuran_rt: safeNum(rt), pengangguran: safeNum(pengangguran),
        produksi_dari_model: prodGabah // WAJIB GABAH untuk Demand Input
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/rice/predict/demand`, {
         method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
       });
       
       if(!res.ok) throw new Error("API Error");
   
       const data = await res.json();
       setDemResult(data.demand);
       
       // REFRESH GRAFIK: Sekarang data sudah masuk ke rice_divre_predictions di DB
       fetchHistoryAndUpdateChart();
       
     } catch (err) { 
       alert("Gagal memprediksi permintaan."); 
     } finally { 
       setLoadingDem(false); 
     }
   };

  const isSurplus = (prodBeras !== null && demResult !== null) ? (prodBeras >= demResult) : true;

  return (
    <div className="min-h-screen bg-[#0d1117] p-4 md:p-8 text-gray-300 font-sans">
      <Link href={`/project/${projectId}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-400 mb-6 font-mono text-xs transition-colors">
        <ArrowLeft size={14}/> BACK_TO_PROJECT_REPORT
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-[#30363d] pb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-mono text-white mb-2 italic">{"//"} RICE_PREDICTION_STUDIO</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest">Historical Data (Since 2007) + Predictive Modeling</p>
        </div>
        <div className="flex gap-4 items-center bg-[#161b22] p-3 rounded-xl border border-[#30363d]">
          <div>
            <label className="block text-[10px] uppercase font-mono text-emerald-500 mb-1">Target Year</label>
            <input type="number" min="2025" max="2030" value={inputYear} onChange={e => setInputYear(Number(e.target.value))} className="bg-[#0d1117] border border-[#30363d] text-white rounded px-3 py-1.5 text-sm focus:border-emerald-500 outline-none w-24 transition-colors"/>
          </div>
          <div>
            <label className="block text-[10px] uppercase font-mono text-cyan-500 mb-1">Regional Focus</label>
            <select value={provinsi} onChange={e => setProvinsi(e.target.value)} className="bg-[#0d1117] border border-[#30363d] text-white rounded px-3 py-1.5 text-sm focus:border-cyan-500 outline-none transition-colors">
              {DIVRE_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* --- FORM SECTION --- */}
        <div className="lg:col-span-7 bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-xl relative">
          <div className="flex items-start gap-3 mb-6 bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl">
             <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
             <p className="text-[10px] text-blue-200">
               <span className="font-bold">GAIN Imputation Active:</span> Form otomatis terisi dengan baseline tahun terakhir. Kosongkan nilai untuk prediksi GAIN otomatis.
             </p>
          </div>

          <div className="flex border border-[#30363d] rounded-lg p-1 bg-[#0d1117] mb-6">
            <button onClick={() => setActiveTab("production")} className={`flex-1 py-2 text-xs font-mono uppercase tracking-widest rounded-md transition-all ${activeTab === 'production' ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:text-white'}`}>
              Model Produksi
            </button>
            <button onClick={() => setActiveTab("demand")} className={`flex-1 py-2 text-xs font-mono uppercase tracking-widest rounded-md transition-all ${activeTab === 'demand' ? 'bg-cyan-600 text-white' : 'text-gray-500 hover:text-white'}`}>
              Model Permintaan
            </button>
          </div>

          {activeTab === "production" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: "Luas Panen (Ha)", val: luasPanen, set: setLuasPanen },
                  { label: "Produktivitas (ton/ha)", val: produktivitas, set: setProduktivitas },
                  { label: "Curah Hujan (mm)", val: curahHujan, set: setCurahHujan },
                  { label: "Hari Hujan", val: hariHujan, set: setHariHujan },
                  { label: "Suhu Min (°C)", val: suhuMin, set: setSuhuMin },
                  { label: "Suhu Rata (°C)", val: suhuRata, set: setSuhuRata },
                  { label: "Suhu Maks (°C)", val: suhuMaks, set: setSuhuMaks },
                  { label: "Kelembapan (%)", val: kelembapan, set: setKelembapan },
                  { label: "Angin (m/s)", val: angin, set: setAngin },
                  { label: "Tekanan Udara (mb)", val: tekanan, set: setTekanan },
                  { label: "Penyinaran (%)", val: sinar, set: setSinar },
                  { label: "SOI BOM Tahunan", val: soi, set: setSoi },
                  { label: "DMI Tahunan", val: dmi, set: setDmi },
                ].map((item, idx) => (
                  <div key={idx}>
                    <label className="block text-[9px] uppercase text-gray-400 mb-1">{item.label}</label>
                    <input type="number" step="any" value={item.val} onChange={e=>item.set(e.target.value ? Number(e.target.value) : "")} disabled={loadingBaseline} className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-xs text-white focus:border-emerald-500 outline-none" placeholder={loadingBaseline ? "Loading..." : "Auto..."}/>
                  </div>
                ))}
                
                {/* Text Input Khusus untuk SOI Label */}
                <div>
                   <label className="block text-[9px] uppercase text-gray-400 mb-1">Label SOI BOM</label>
                   <input type="text" value={soiLabel} onChange={e=>setSoiLabel(e.target.value)} disabled={loadingBaseline} className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-xs text-white focus:border-emerald-500 outline-none" placeholder={loadingBaseline ? "Loading..." : "Auto..."}/>
                </div>

              </div>
              <button onClick={handlePredictProduction} disabled={loadingProd || loadingBaseline} className="w-full py-4 mt-4 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/50 rounded-lg font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                {loadingProd ? <Loader2 className="animate-spin" size={16}/> : <RefreshCw size={16}/>} Hitung Produksi (XGBoost)
              </button>
            </div>
          )}

          {activeTab === "demand" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="col-span-2 md:col-span-3">
                   <label className="block text-[9px] uppercase text-emerald-500 mb-1 font-bold">Produksi Gabah (Input Internal Model 1)</label>
                   <input type="text" readOnly value={prodGabah ? `${formatTon(prodGabah)} Ton` : "Menunggu Prediksi Produksi..."} className="w-full bg-emerald-900/10 border border-emerald-500/30 text-emerald-400 font-mono rounded p-2 text-xs outline-none" />
                </div>
                {[
                  { label: "Populasi (Jiwa)", val: populasi, set: setPopulasi },
                  { label: "Pertumbuhan Pop (%)", val: pertumbuhan, set: setPertumbuhan },
                  { label: "Harga Beras (Rp/kg)", val: hargaBeras, set: setHargaBeras },
                  { label: "Harga Jagung (Rp/kg)", val: hargaJagung, set: setHargaJagung },
                  { label: "Harga Mi (Rp)", val: hargaMi, set: setHargaMi },
                  { label: "Kemiskinan (%)", val: kemiskinan, set: setKemiskinan },
                  { label: "Garis Kemiskinan (Rp)", val: garisKemiskinan, set: setGarisKemiskinan },
                  { label: "PDRB Per Kapita", val: pdrb, set: setPdrb },
                  { label: "Rasio Gini", val: gini, set: setGini },
                  { label: "Ukuran RT (Jiwa)", val: rt, set: setRt },
                  { label: "Pengangguran (%)", val: pengangguran, set: setPengangguran },
                ].map((item, idx) => (
                  <div key={idx}>
                    <label className="block text-[9px] uppercase text-gray-400 mb-1">{item.label}</label>
                    <input type="number" step="any" value={item.val} onChange={e=>item.set(e.target.value ? Number(e.target.value) : "")} disabled={loadingBaseline} className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-xs text-white focus:border-cyan-500 outline-none" placeholder={loadingBaseline ? "Loading..." : "Auto..."}/>
                  </div>
                ))}
              </div>
              <button onClick={handlePredictDemand} disabled={loadingDem || prodGabah === null} className={`w-full py-4 mt-4 rounded-lg font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${prodGabah === null ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-[#30363d]' : 'bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-400 border border-cyan-500/50'}`}>
                {loadingDem ? <Loader2 className="animate-spin" size={16}/> : <TrendingUp size={16}/>} Hitung Permintaan (Bi-LSTM)
              </button>
            </div>
          )}
        </div>

        {/* --- RESULTS PANEL --- */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 text-center shadow-lg relative overflow-hidden flex-1 flex flex-col justify-center">
            <div className="absolute -left-4 -bottom-4 opacity-5"><Box size={100}/></div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-mono">Forecasted Production (Beras)</p>
            <p className="text-3xl font-bold text-emerald-400 font-mono">{formatTon(prodBeras)} <span className="text-xs text-gray-500 font-sans">TONS</span></p>
          </div>
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 text-center shadow-lg relative overflow-hidden flex-1 flex flex-col justify-center">
            <div className="absolute -left-4 -bottom-4 opacity-5"><Activity size={100}/></div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-mono">Forecasted Demand</p>
            <p className="text-3xl font-bold text-cyan-400 font-mono">{formatTon(demResult)} <span className="text-xs text-gray-500 font-sans">TONS</span></p>
          </div>
          <div className={`bg-[#161b22] border rounded-xl p-6 text-center shadow-lg transition-colors flex-1 flex flex-col justify-center ${prodBeras !== null && demResult !== null ? (isSurplus ? 'border-emerald-500/50' : 'border-red-500/50') : 'border-[#30363d]'}`}>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-mono">Status ({provinsi})</p>
            <p className={`text-2xl font-bold font-mono ${prodBeras !== null && demResult !== null ? (isSurplus ? 'text-emerald-400' : 'text-red-400') : 'text-gray-600'}`}>
              {prodBeras !== null && demResult !== null ? (isSurplus ? 'SURPLUS' : 'DEFICIT') : 'WAITING'}
            </p>
            <p className="text-[10px] text-gray-400 mt-1">{prodBeras !== null && demResult !== null ? `Gap: ${formatTon(Math.abs(prodBeras - demResult))} Tons` : "Lakukan prediksi produksi & permintaan"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-xl">
          <h3 className="font-mono text-xs text-gray-400 uppercase mb-6 flex items-center gap-2"><BarChart3 size={14} className="text-emerald-400"/> History (2007) & Forecast Trend</h3>
          <div className="h-[300px] w-full">
            {chartData ? (
               <Line 
               options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  plugins: {
                     legend: {
                     display: true,
                     labels: { color: '#9ca3af', font: { family: 'JetBrains Mono', size: 10 } }
                     },
                     tooltip: {
                     backgroundColor: '#161b22',
                     titleFont: { family: 'JetBrains Mono' },
                     bodyFont: { family: 'Inter' },
                     borderColor: '#30363d',
                     borderWidth: 1
                     }
                  },
                  scales: {
                     x: { 
                        grid: { color: '#30363d' }, 
                        ticks: {
                           color: '#6b7280',
                           callback: function(value) {
                              return typeof value === "number"
                                ? this.getLabelForValue(value)
                                : value;
                            },
                           maxRotation: 45,
                           minRotation: 45
                         }
                         
                      },
                     y: { grid: { color: '#30363d' }, ticks: { color: '#6b7280' } }
                  }
               }} 
               data={chartData} 
               />
            ) : (
              <div className="h-full flex items-center justify-center font-mono text-xs text-gray-600">Syncing database...</div>
            )}
          </div>
        </div>
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-xl min-h-[350px] flex flex-col">
          <h3 className="font-mono text-xs text-gray-400 uppercase mb-6 flex items-center gap-2"><MapIcon size={14} className="text-cyan-400"/> Divre Spatial Focus</h3>
          <div className="flex-1 relative rounded-xl overflow-hidden border border-[#30363d]">
            <RiceMap provinsi={provinsi} production={prodBeras} demand={demResult} />
          </div>
        </div>
      </div>
    </div>
  );
}