'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/* ── Icon SVGs ── */
const IconHome = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const IconOrder = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z" />
  </svg>
);

const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 000 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />
  </svg>
);

const IconStaff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);

const IconTable = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h15v14zm-9-2h2v-3h3v-2h-3V9h-2v3H8v2h3z" />
  </svg>
);

const IconRevenue = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
  </svg>
);

const IconReview = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9l-1 2h-2l-1-2V7h1v4h2V7h1v4z" />
  </svg>
);

const navItems = [
  { label: 'Beranda',        href: '/owner/beranda',          match: '/owner/beranda',          icon: '/mi_home.png' },
  { label: 'Pesanan',        href: '/owner/pesanan/masuk',    match: '/owner/pesanan',          icon: '/lsicon_work-order-outline.png' },
  { label: 'Manajemen Menu', href: '/owner/menu',             match: '/owner/menu',             icon: '/simple-icons_justeat.png' },
  { label: 'Data Staff',     href: '/owner/data-staff',       match: '/owner/data-staff',       icon: '/majesticons_user-box-line.png' },
  { label: 'Kelola Meja',    href: '/owner/meja',             match: '/owner/meja',             icon: '/Vector (4).png' },
];

export default function OwnerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-52 min-h-screen bg-[#9b0d0d] text-white flex flex-col shrink-0">

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
