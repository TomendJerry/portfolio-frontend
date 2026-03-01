"use client";
import { useState } from "react";
import { Star, Send, Loader2 } from "lucide-react";

export function RatingSystem() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (score === 0) return alert("Silakan pilih bintang terlebih dahulu");
    setLoading(true);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/rating/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score, comment, category: "General" }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const err = await res.json();
        alert(err.detail || "Gagal mengirim rating");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return (
    <div className="text-center p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
      <p className="text-emerald-400 font-mono italic">{"//"} TERIMA_KASIH_ATAS_PENILAIAN_ANDA!</p>
    </div>
  );

  return (
    <section className="py-12 bg-[#161b22] border border-[#30363d] rounded-2xl p-8 max-w-2xl mx-auto my-12">
      <h3 className="text-xl font-mono text-white mb-6 flex items-center gap-2">
        <span className="text-emerald-400">{"//"}</span> Rate_My_Portfolio
      </h3>
      
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setScore(star)}
            className="transition-transform hover:scale-110"
          >
            <Star 
              size={32} 
              className={star <= (hover || score) ? "fill-emerald-400 text-emerald-400" : "text-gray-600"} 
            />
          </button>
        ))}
      </div>

      <textarea
        placeholder="Berikan feedback singkat Anda (Opsional)..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-3 text-sm text-white focus:border-emerald-500 outline-none mb-4 min-h-[100px]"
      />

      <button
        onClick={handleSubmit}
        disabled={loading || score === 0}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-mono text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" /> : <Send size={16} />}
        KIRIM_PENILAIAN
      </button>
    </section>
  );
}