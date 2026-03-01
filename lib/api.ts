// lib/api.ts
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

export interface HistoryData {
  tahun: number;
  produksi: number | null;
  demand: number | null;
  type?: "history" | "prediction";
}

// ==========================
// TYPE DEFINITIONS
// ==========================

export interface PredictProductionPayload {
    tahun: number;
    provinsi: string;
    luas_panen?: number | null;
    produktivitas?: number | null;
    suhu_min?: number | null;
    suhu_rata?: number | null;
    suhu_maks?: number | null;
    kelembapan?: number | null;
    curah_hujan?: number | null;
    hari_hujan?: number | null;
    kecepatan_angin?: number | null;
    tekanan_udara?: number | null;
    penyinaran?: number | null;
    annual_soi_bom?: number | null;
    soi_label?: string;
    annual_dmi?: number | null;
  }
  
  export interface PredictDemandPayload {
    tahun: number;
    provinsi: string;
    populasi?: number | null;
    pertumbuhan_pop?: number | null;
    harga_beras?: number | null;
    harga_jagung?: number | null;
    harga_mi?: number | null;
    kemiskinan?: number | null;
    garis_kemiskinan?: number | null;
    pdrb?: number | null;
    gini?: number | null;
    ukuran_rt?: number | null;
    pengangguran?: number | null;
    produksi_dari_model: number; // WAJIB
  }

export const RiceAPI = {
  getBaseline: async (provinsi: string) => {
    const res = await fetch(`${BASE_URL}/rice/baseline/${provinsi}`);
    if (!res.ok) throw new Error("Failed to fetch baseline");
    return res.json();
  },

  getChartData: async (provinsi: string): Promise<HistoryData[]> => {
    const res = await fetch(`${BASE_URL}/rice/chart-data/${provinsi}`);
    if (!res.ok) throw new Error("Failed to fetch chart data");
    return res.json();
  },

predictProduction: async (payload: PredictProductionPayload) => {
  const res = await fetch(`${BASE_URL}/predict/production`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Production prediction failed");
  return res.json();
},

predictDemand: async (payload: PredictDemandPayload) => {
  const res = await fetch(`${BASE_URL}/predict/demand`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Demand prediction failed");
  return res.json();
},
};