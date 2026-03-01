"use client";

import { Layers, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center bg-[#0d1117] overflow-hidden">
      
      {/* 1. BACKGROUND LAYER (z-0) */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-hero" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#06b6d4" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-hero)" />
          
          {/* Animated Node Connections */}
          <g className="text-emerald-500/40">
            <circle cx="20%" cy="30%" r="3" fill="currentColor" className="animate-pulse" />
            <circle cx="80%" cy="20%" r="2" fill="currentColor" className="animate-pulse" />
            <circle cx="70%" cy="70%" r="4" fill="currentColor" className="animate-pulse" />
            <circle cx="30%" cy="80%" r="3" fill="currentColor" className="animate-pulse" />
            <line x1="20%" y1="30%" x2="80%" y2="20%" stroke="currentColor" strokeWidth="0.5" />
            <line x1="80%" y1="20%" x2="70%" y2="70%" stroke="currentColor" strokeWidth="0.5" />
            <line x1="70%" y1="70%" x2="30%" y2="80%" stroke="currentColor" strokeWidth="0.5" />
          </g>
        </svg>
      </div>

      {/* 2. CONTENT LAYER (z-10) */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center">
        
        {/* Terminal Badge */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-gray-900/80 border border-[#30363d] rounded-full backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <p className="font-mono text-xs text-gray-400">
            <span className="text-emerald-400">nasir@lab:</span>
            <span className="text-cyan-400">~</span>$ whoami --status
          </p>
        </div>

        {/* Title */}
        <h1 className="font-mono text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-white animate-in fade-in slide-in-from-bottom-4 duration-700">
          PERSONAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">TECH LAB</span>
        </h1>
        
        {/* Description */}
        <p className="max-w-2xl text-lg md:text-xl text-gray-400 mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000">
          Integrated systems for <span className="text-gray-200">machine learning research</span>, 
          environmental data analytics, and scalable cloud infrastructure.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <a 
            href="#projects" 
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-gray-900 font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/20"
          >
            EXPLORE_PROJECTS
          </a>
          <a 
            href="#contact" 
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-[#30363d] hover:border-cyan-500/50 text-white hover:bg-cyan-500/5 rounded-xl transition-all"
          >
            GET_IN_TOUCH
          </a>
        </div>
      </div>

      {/* 3. SCROLL INDICATOR (Ditempatkan secara Absolute terhadap Section) */}
      <div className="absolute bottom-10 left-0 right-0 z-20 hidden md:flex flex-col items-center gap-3 opacity-50 hover:opacity-100 transition-opacity pointer-events-none">
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-gray-500">
          SCROLL_TO_EXPLORE
        </span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-cyan-500 via-emerald-500 to-transparent"></div>
      </div>

    </section>
  );
}