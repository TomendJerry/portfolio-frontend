import { 
  Database, 
  Code2, 
  Zap, 
  Brain, 
  Cpu, 
  Layers, 
  Terminal, 
  BarChart3 
} from 'lucide-react';

export function TechStack() {
  const technologies = [
    { name: 'Python', icon: Terminal },
    { name: 'FastAPI', icon: Zap },
    { name: 'TensorFlow', icon: Brain },
    { name: 'Scikit-Learn', icon: Layers },
    { name: 'Next.js', icon: Code2 },
    { name: 'PostgreSQL', icon: Database },
    { name: 'IoT (ESP8266)', icon: Cpu },
    { name: 'Data Analysis', icon: BarChart3 }
  ];

  return (
    <section className="py-16 bg-[#0a0e13] px-6 border-y border-[#30363d]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-12">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#30363d]"></div>
          <h3 className="font-mono text-xs tracking-[0.2em] text-gray-500 px-6">TECH STACK / LAB TOOLS</h3>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#30363d]"></div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-10">
          {technologies.map((tech, index) => (
            <div 
              key={index}
              className="group flex flex-col items-center gap-3 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative w-16 h-16 flex items-center justify-center bg-gray-900/30 border border-[#30363d] rounded-xl overflow-hidden group-hover:border-emerald-500/40 group-hover:bg-emerald-500/5 transition-all">
                {/* Background Glow Effect on Hover */}
                <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-all duration-500 blur-xl"></div>
                
                <tech.icon 
                  className="relative w-8 h-8 text-gray-500 group-hover:text-emerald-400 transition-colors duration-300" 
                  strokeWidth={1.5} 
                />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-gray-600 group-hover:text-gray-300 transition-colors">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}