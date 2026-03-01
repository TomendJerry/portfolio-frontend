// Frontend/components/About.tsx
import { User, Code, Microscope, Zap } from 'lucide-react';

export function About() {
  return (
    <section id="about" className="py-24 bg-[#0d1117] px-6 border-t border-[#30363d]">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-['JetBrains_Mono'] text-3xl md:text-4xl text-white mb-12 flex items-center gap-3">
          <span className="text-emerald-400">{"//"}</span> About_Me
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* Sisi Kiri: Foto atau Ilustrasi Profil */}
          <div className="relative group mx-auto md:mx-0">
            <div className="w-64 h-64 border-2 border-emerald-500/30 rounded-lg absolute top-4 left-4 group-hover:top-2 group-hover:left-2 transition-all duration-300"></div>
            <div className="w-64 h-64 bg-gray-800 rounded-lg relative z-10 overflow-hidden border border-[#30363d]">
              {/* Silakan ganti src dengan path foto asli Anda */}
              <img 
                src="/Me.jpg" 
                alt="Saifudin Nasir" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>

          {/* Sisi Kanan: Konten Biografi */}
          <div className="md:col-span-2 space-y-6">
            <p className="font-['Inter'] text-lg text-gray-400 leading-relaxed text-justify">
              Saya adalah <span className="text-white font-bold">Saifudin Nasir</span> seorang <span className="text-white font-bold">Informatics Engineering Graduate</span> dari Universitas Gunadarma dengan IPK 3.59 yang memiliki fokus mendalam pada bidang <span className="text-emerald-400">Machine Learning</span> dan <span className="text-emerald-400">Full-stack Web Development</span>. Perjalanan teknologi saya berakar dari fondasi kuat di bidang Elektronika Industri dari SMKN 29 Jakarta, yang memberikan saya perspektif unik dalam memahami sinergi antara sistem perangkat keras dan arsitektur perangkat lunak.
            </p>

            <p className="font-['Inter'] text-lg text-gray-400 leading-relaxed text-justify">
              Sebagai seorang peneliti dan pengembang, saya terbiasa menangani proyek berbasis data yang kompleks dengan mengimplementasikan berbagai algoritma prediktif seperti <span className="text-cyan-400 font-mono">Random Forest, XGBoost, dan LSTM</span>. Saya telah berhasil membangun platform pemetaan karbon mangrove berbasis web yang menggunakan model Machine Learning untuk analisis lingkungan yang presisi.
            </p>

            <p className="font-['Inter'] text-lg text-gray-400 leading-relaxed text-justify">
              Salah satu kontribusi teknis utama saya adalah keterlibatan dalam proyek riset strategis di tingkat universitas. Saya mengembangkan model <span className="italic text-white">Hybrid ML</span> dan <span className="italic text-white">Generative AI</span> yang dirancang untuk mendukung ketahanan pangan nasional melalui prediksi ketersediaan beras. Pengalaman ini mengasah kemampuan saya dalam mengintegrasikan kecerdasan buatan ke dalam sistem yang berdampak luas.
            </p>

            <p className="font-['Inter'] text-lg text-gray-400 leading-relaxed text-justify">
              Dalam membangun solusi digital, saya mengandalkan ekosistem <span className="text-cyan-400 font-mono">Python dan FastAPI</span> untuk pengembangan backend yang tangguh, serta <span className="text-cyan-400 font-mono">React atau Next.js</span> untuk menciptakan antarmuka pengguna yang responsif.
            </p>

            {/* Grid Keahlian Cepat */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#30363d]">
              <div className="flex items-center gap-3 text-gray-300 font-mono text-sm">
                <Code className="text-emerald-400 w-5 h-5" /> 
                <span>FastAPI & Next.js</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 font-mono text-sm">
                <Microscope className="text-emerald-400 w-5 h-5" /> 
                <span>AI/ML Research</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 font-mono text-sm">
                <Zap className="text-emerald-400 w-5 h-5" /> 
                <span>System Architecture</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 font-mono text-sm">
                <User className="text-emerald-400 w-5 h-5" /> 
                <span>Technical Analysis</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}