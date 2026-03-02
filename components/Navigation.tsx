"use client";

import Link from 'next/link';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Lock } from 'lucide-react'; // Import icon gembok
import { trackVisitor } from '@/lib/tracker'

export function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isAdminPage = pathname.startsWith('/admin');

  useEffect(() => {
    const actionLabel = `Maps_TO: ${pathname === '/' ? 'HOME' : pathname.toUpperCase()}`;
    trackVisitor(actionLabel);
  }, [pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d1117]/80 backdrop-blur-md border-b border-[#30363d]">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link 
              href="/" 
              className="font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Lab
            </Link>
            
            {/* Navigasi Anchor hanya muncul di Homepage */}
            {isHome && (
              <>
                <a 
                  href="#projects" 
                  className="font-sans text-gray-400 hover:text-gray-200 transition-colors"
                >
                  Projects
                </a>
                <a 
                  href="#contact" 
                  className="font-sans text-gray-400 hover:text-gray-200 transition-colors"
                >
                  Contact
                </a>
              </>
            )}

            {/* Jika sedang di halaman admin, beri penanda */}
            {isAdminPage && (
              <span className="font-mono text-xs text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded border border-cyan-400/20">
                ADMIN_SESSION
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Indikator System Online */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono text-sm text-gray-400 hidden sm:inline">System Online</span>
            </div>

            {/* Hidden Entry to Admin Dashboard */}
            <Link 
              href="/login" // Ubah dari /admin ke /login
              className="p-2 text-gray-600 hover:text-cyan-400 transition-colors rounded-lg hover:bg-gray-800/50"
              title="Admin Login"
            >
              <Lock size={16} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}