'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Beranda',        href: '/kasir/beranda',          match: '/kasir/beranda',          icon: '/mi_home.png' },
  { label: 'Pesan Ditempat', href: '/kasir/pesan-ditempat',   match: '/kasir/pesan-ditempat',   icon: '/simple-icons_justeat.png' },
  { label: 'Daftar Pesanan', href: '/kasir/daftar-pesanan/semua', match: '/kasir/daftar-pesanan', icon: '/lsicon_work-order-outline.png' },
  { label: 'Kelola Meja',    href: '/kasir/kelola-meja',      match: '/kasir/kelola-meja',      icon: '/Vector (4).png' },
];

export default function KasirSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-52 min-h-screen bg-[#9b0d0d] text-white flex flex-col shrink-0">
      <div className="flex items-center gap-2 px-4 py-5 border-b border-white/10">
        <div className="w-10 h-10 flex items-center justify-center shrink-0">
          <img src="/Group 2 1.png" alt="Logo D" className="w-full h-full object-contain" />
        </div>
        <span className="text-white font-extrabold text-sm tracking-widest leading-tight">
          DE CAFENTA
        </span>
      </div>

      <nav className="flex-1 py-3 overflow-y-auto">
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
                  {/* Icon kiri */}
                  <img src={item.icon} alt={item.label} className={`w-5 h-5 shrink-0 object-contain ${isActive ? 'invert brightness-0' : ''}`} style={{ filter: isActive ? 'brightness(0) invert(1)' : 'brightness(0) invert(1) opacity(0.75)' }} />
                  {/* Label kanan */}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}