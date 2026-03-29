'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import NavLink from './NavLink';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
            🍳
          </span>
          <span className="font-display text-lg sm:text-xl font-bold text-text-primary">
            Masak<span className="text-accent">Apa</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink href="/" active={pathname === '/'}>
            Cari Resep
          </NavLink>
          <NavLink href="/saved" active={pathname === '/saved'}>
            ♥ Favorit
          </NavLink>
        </div>

        {/* Hamburger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-card2 transition cursor-pointer"
        >
          <span className="text-xl">{isOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <NavLink href="/" active={pathname === '/'} mobile>
            Cari Resep
          </NavLink>
          <NavLink href="/saved" active={pathname === '/saved'} mobile>
            ♥ Favorit
          </NavLink>
        </div>
      )}
    </nav>
  );
}
