import { Mail, Github, Linkedin, FileText } from 'lucide-react';
import { trackVisitor } from '@/lib/tracker';

export function Contact() {
  const links = [
    {
      icon: Github,
      label: 'GitHub',
      url: 'https://github.com/TomendJerry',
      handle: 'TomandJerry'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/saifudin-nasir',
      handle: 'Saifudin Nasir'
    },
    {
      icon: Mail,
      label: 'Email',
      url: 'mailto:saifudinnasirs@gmail.com',
      handle: 'saifudinnasirs@gmail.com'
    },
    {
      icon: FileText,
      label: 'Resume',
      // Tanpa preview=true agar otomatis menjadi 'attachment' (Download)
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/resume/active/download`,
      handle: 'Download CV'
    }
  ];

  const handleLinkClick = (label: string) => {
    trackVisitor(`CLICK_EXTERNAL_LINK: ${label.toUpperCase()}`);
  };

  return (
    <section id="contact" className="py-24 bg-[#0a0e13] px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-['JetBrains_Mono'] text-3xl md:text-4xl text-white mb-6">
          <span className="text-cyan-400">{"//"}</span> Get in Touch
        </h2>
        
        <p className="font-['Inter'] text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Open to collaboration on research projects, technical consulting, and building experimental systems.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              onClick={() => handleLinkClick(link.label)}
              className="group p-6 bg-gray-900/30 border border-[#30363d] hover:border-[#10b981]/50 rounded-lg transition-all duration-300"
            >
              <link.icon className="w-6 h-6 text-[#10b981] mb-4 mx-auto group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <div className="font-['JetBrains_Mono'] text-sm text-white mb-2">
                {link.label}
              </div>
              <div className="font-['Inter'] text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                {link.handle}
              </div>
            </a>
          ))}
        </div>

        <div className="pt-12 border-t border-[#30363d]">
          <p className="font-['JetBrains_Mono'] text-sm text-gray-500">
            <span className="text-[#06b6d4]">$</span> Built with React, TypeScript, and Tailwind CSS
          </p>
          <p className="font-['Inter'] text-sm text-gray-600 mt-2">
            © 2026 Personal Tech Lab. Open source and privacy-focused.
          </p>
        </div>
      </div>
    </section>
  );
}