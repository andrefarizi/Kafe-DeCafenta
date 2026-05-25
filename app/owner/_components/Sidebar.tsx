'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { X, Menu } from 'lucide-react';

/* ── Icon SVGs ── */
const IconHome = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const navItems = [
  { label: 'Beranda',        href: '/owner/beranda',          match: '/owner/beranda',          icon: '/mi_home.png' },
  { label: 'Pesanan',        href: '/owner/pesanan',          match: '/owner/pesanan',          icon: '/lsicon_work-order-outline.png' },
  { label: 'Manajemen Menu', href: '/owner/menu',             match: '/owner/menu',             icon: '/simple-icons_justeat.png' },
  { label: 'Data Staff',     href: '/owner/data-staff',       match: '/owner/data-staff',       icon: '/majesticons_user-box-line.png' },
  { label: 'Kelola Meja',    href: '/owner/meja',             match: '/owner/meja',             icon: '/Vector (4).png' },
];

export default function OwnerSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Tutup drawer saat navigasi
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Tutup drawer jika layar membesar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const NavLinks = () => (
    <ul className="flex flex-col gap-0.5 px-2">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.match);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-[#6b1212] text-white'
                  : 'text-white/75 hover:bg-white/10 hover:text-white'
              }`}
            >
              <img src={item.icon} alt={item.label} className="w-5 h-5 shrink-0 object-contain" style={{ filter: isActive ? 'brightness(0) invert(1)' : 'brightness(0) invert(1) opacity(0.75)' }} />
              <span>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* ── Sidebar Desktop (md ke atas) ── */}
      <aside className="hidden md:flex w-52 h-full bg-[#9b0d0d] text-white flex-col shrink-0 sticky top-0">
        {/* ── Logo ── */}
        <div className="flex items-center gap-2 px-4 py-5 border-b border-white/10">
          <div className="w-10 h-10 flex items-center justify-center shrink-0">
            <img src="/Group 2 1.png" alt="Logo D" className="w-full h-full object-contain" />
          </div>
          <span className="text-white font-extrabold text-sm tracking-widest leading-tight">
            DE CAFENTA
          </span>
        </div>

        {/* ── Nav ── */}
        <nav className="w-full sm:flex-1 py-3 overflow-y-auto">
          <NavLinks />
        </nav>
      </aside>



      {/* ── Bottom Navigation Mobile ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#9b0d0d] border-t border-white/10 flex items-center justify-around px-1 py-2 shadow-2xl">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.match);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-1 py-2.5 rounded-lg transition-all duration-150 min-w-0 flex-1 ${
                isActive ? 'bg-[#6b1212]' : 'hover:bg-white/10'
              }`}
            >
              <img
                src={item.icon}
                alt={item.label}
                className="w-5 h-5 object-contain shrink-0"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <span className={`text-[9px] font-semibold text-center leading-tight truncate w-full text-center ${isActive ? 'text-white' : 'text-white/70'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
