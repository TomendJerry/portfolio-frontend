"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const DIVRE_COORDS: Record<string, [number, number]> = {
  "Nanggroe Aceh Darussalam": [5.548, 95.323], "Sumatera Utara": [3.595, 98.672], "Sumatera Barat": [-0.947, 100.417],
  "Riau": [0.507, 101.447], "DKI Jakarta": [-6.208, 106.845], "Jawa Barat": [-6.917, 107.619],
  "Jawa Tengah": [-7.005, 110.438], "Jawa Timur": [-7.257, 112.752], "Sulawesi Selatan": [-5.147, 119.432]
};

interface RiceMapProps {
  provinsi: string;
  production: number | null;
  demand: number | null;
}

function MapController({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(coords, 6, { animate: true, duration: 1.5 });
  }, [coords, map]);
  return null;
}

export default function RiceMap({ provinsi, production, demand }: RiceMapProps) {
  const coords = DIVRE_COORDS[provinsi] || [-2.5489, 118.0149];
  
  // Pengecekan Aman (Safe Check)
  const isReady = typeof production === 'number' && typeof demand === 'number';
  const isSurplus = isReady ? (production >= demand) : true;

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden relative bg-[#0d1117]">
      <div className="absolute top-4 right-4 z-[1000] bg-[#0d1117]/80 p-3 rounded-lg border border-[#30363d] backdrop-blur-md">
         <h4 className="text-[10px] font-mono text-gray-400 uppercase mb-2">Focused Region</h4>
         <div className="flex items-center gap-2 text-[11px] font-bold text-white uppercase tracking-widest">
            <span className={`w-2 h-2 rounded-full ${isReady ? (isSurplus ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]') : 'bg-gray-500'}`}></span>
            {provinsi}
         </div>
      </div>

      <MapContainer center={coords} zoom={6} style={{ height: "100%", width: "100%", background: "#0d1117" }}>
        <TileLayer 
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap contributors'
        />
        <MapController coords={coords} />
        
        <CircleMarker 
          center={coords} 
          radius={isReady ? 15 : 8}
          pathOptions={{
            fillColor: isReady ? (isSurplus ? "#10b981" : "#ef4444") : "#6b7280",
            color: isReady ? (isSurplus ? "#10b981" : "#ef4444") : "#6b7280",
            weight: 2, fillOpacity: 0.6
          }}
        >
          <Popup className="custom-popup">
            <div className="font-sans p-2">
              <h3 className="font-bold border-b border-gray-100 mb-2 uppercase text-gray-800">{provinsi}</h3>
              {isReady ? (
                <div className="text-xs space-y-1 text-gray-700">
                  <p>Produksi: <span className="font-mono">{(production).toLocaleString()} Ton</span></p>
                  <p>Permintaan: <span className="font-mono">{(demand).toLocaleString()} Ton</span></p>
                  <p className={`font-bold mt-2 ${isSurplus ? 'text-emerald-600' : 'text-red-600'}`}>
                    Status: {isSurplus ? 'SURPLUS' : 'DEFISIT'}
                  </p>
                </div>
              ) : (
                <div className="text-xs text-gray-500 italic">Lakukan kedua prediksi untuk melihat data.</div>
              )}
            </div>
          </Popup>
          <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
            <span className="font-mono text-[10px] font-bold">{provinsi}</span>
          </Tooltip>
        </CircleMarker>
      </MapContainer>
    </div>
  );
}