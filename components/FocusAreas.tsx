"use client";

import { Brain, Code2, Leaf } from 'lucide-react';

export function FocusAreas() {
  const areas = [
    {
      icon: Brain,
      title: 'Machine Learning',
      description: 'Developing predictive systems using Random Forest and Deep Learning architectures. Specialized in processing environmental data and financial time-series for practical insights.',
      tags: ['Scikit-learn', 'TensorFlow', 'Random Forest', 'XGBoost']
    },
    {
      icon: Code2,
      title: 'Full Stack Lab',
      description: 'Building robust web-based analytics dashboards. Focused on creating seamless integration between Machine Learning backends (FastAPI) and interactive frontends (Next.js).',
      tags: ['Next.js', 'FastAPI', 'PostgreSQL', 'Tailwind']
    },
    {
      icon: Leaf,
      title: 'Applied Research',
      description: 'Applying computational methods to environmental and food security challenges, such as Mangrove biomass estimation and regional rice production forecasting systems.',
      tags: ['IoT', 'GIS', 'ESP8266', 'Data Analysis']
    }
  ];

  return (
    <section id="focus-areas" className="py-24 bg-[#0d1117] px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-mono text-3xl md:text-4xl text-white mb-16 text-center">
          <span className="text-cyan-400">{"//"}</span> Focus Areas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {areas.map((area, index) => (
            <div 
              key={index}
              className="group p-8 bg-gray-900/30 border border-[#30363d] hover:border-emerald-500/50 rounded-lg transition-all duration-300"
            >
              <div className="mb-6">
                <div className="inline-flex p-3 bg-gray-800/50 rounded-lg border border-[#30363d] group-hover:border-emerald-500/50 transition-colors">
                  <area.icon className="w-6 h-6 text-[#10b981]" strokeWidth={1.5} />
                </div>
              </div>

              <h3 className="font-mono text-xl text-white mb-4">
                {area.title}
              </h3>

              <p className="font-sans text-gray-400 mb-6 leading-relaxed">
                {area.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {area.tags.map((tag, tagIndex) => (
                  <span 
                    key={tagIndex}
                    className="font-mono text-[10px] uppercase tracking-wider px-3 py-1 bg-gray-800 text-[#06b6d4] rounded border border-[#30363d]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}