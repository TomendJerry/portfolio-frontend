import { FileCode, Book, Terminal, Layers } from 'lucide-react';

export function Documentation() {
  const docs = [
    {
      icon: Terminal,
      title: 'API Reference',
      description: 'Comprehensive documentation for RESTful APIs and data schemas. Includes authentication flows, rate limiting, and error handling patterns.',
      link: '#'
    },
    {
      icon: FileCode,
      title: 'Code Examples',
      description: 'Production-ready code snippets and implementation guides. Covers common patterns in ML pipelines, data processing, and web services.',
      link: '#'
    },
    {
      icon: Layers,
      title: 'Architecture Guides',
      description: 'System design decisions and infrastructure patterns. Learn about scalable deployment strategies and monitoring practices.',
      link: '#'
    },
    {
      icon: Book,
      title: 'Research Notes',
      description: 'Technical write-ups on experiments, benchmarks, and performance optimizations. Includes methodology and reproducibility details.',
      link: '#'
    }
  ];

  return (
    <section id="documentation" className="py-24 bg-[#0d1117] px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="font-['JetBrains_Mono'] text-3xl md:text-4xl text-white mb-4">
            <span className="text-cyan-400">{"//"}</span> Documentation
          </h2>
          <p className="font-['Inter'] text-gray-400 max-w-2xl">
            Technical documentation, implementation guides, and research notes for projects and experiments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {docs.map((doc, index) => (
            <a
              key={index}
              href={doc.link}
              className="group p-8 bg-gray-900/30 border border-[#30363d] hover:border-[#06b6d4]/50 rounded-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-gray-800/50 border border-[#30363d] rounded-lg group-hover:border-[#06b6d4]/50 transition-colors">
                  <doc.icon className="w-5 h-5 text-[#06b6d4]" strokeWidth={1.5} />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-['JetBrains_Mono'] text-lg text-white mb-2 group-hover:text-[#06b6d4] transition-colors">
                    {doc.title}
                  </h3>
                  <p className="font-['Inter'] text-sm text-gray-400 leading-relaxed">
                    {doc.description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}