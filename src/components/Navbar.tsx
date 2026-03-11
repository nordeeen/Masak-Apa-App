'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-base/80 backdrop-blur-md border-b border-border">
      <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
            🍳
          </span>
          <span className="font-display text-xl font-semibold text-text-primary">
            Masak<span className="text-accent">Apa</span>
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              pathname === '/'
                ? 'bg-accent/10 text-accent'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface'
            }`}
          >
            Cari Resep
          </Link>
          <Link
            href="/saved"
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              pathname === '/saved'
                ? 'bg-accent/10 text-accent'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface'
            }`}
          >
            ♥ Favorit
          </Link>
        </div>
      </div>
    </nav>
  );
}
