'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingCart, ClipboardList, LayoutGrid } from 'lucide-react';
import CartBadge from './CartBadge';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const NavItem = ({ icon, label, href, active = false }: NavItemProps) => (
  <Link href={href} className="block">
    <div className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-colors ${active ? 'bg-black/20' : 'hover:bg-black/10'}`}>
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  </Link>
);

const Sidebar = ({ activeMenu }: { activeMenu?: string }) => {
  const pathname = usePathname();
  
  const navItems = [
    {
      icon: <Home size={20} />,
      label: 'Beranda',
      href: '/customer/beranda',
      key: 'beranda',
    },
    {
      icon: (
        <Image
          src="/icon-menu.png"
          alt="Menu Icon"
          width={20}
          height={20}
          className="object-contain grayscale brightness-200"
        />
      ),
      label: 'Menu',
      href: '/customer/menu',
      key: 'menu',
    },
    {
      icon: (
        <div className="relative">
          <ShoppingCart size={20} />
          <CartBadge />
        </div>
      ),
      label: 'Keranjang',
      href: '/customer/keranjang',
      key: 'keranjang',
    },
    {
      icon: <ClipboardList size={20} />,
      label: 'Pesanan',
      href: '/customer/Pesanan',
      key: 'pesanan',
    },
    {
      icon: <LayoutGrid size={20} />,
      label: 'Meja',
      href: '/customer/meja',
      key: 'meja',
    },
  ];

  return (
    <>
      {/* ── Sidebar Desktop (md ke atas) ── */}
      <aside className="hidden md:flex w-54 bg-[#8A0000] text-white flex-col h-screen sticky top-0">
        <div className="p-6 flex items-center gap-2">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <Image
              src="/Group 2 1.png"
              alt="Logo De Cafenta"
              width={35}
              height={35}
              className="object-contain"
            />
          </div>
          <span className="font-bold tracking-wider uppercase">De Cafenta</span>
        </div>

        <nav className="w-full sm:flex-1 mt-4">
          {navItems.map((item) => (
            <NavItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={activeMenu === item.key}
            />
          ))}
        </nav>
      </aside>

      {/* ── Bottom Navigation Mobile ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#8A0000] border-t border-white/10 flex items-center justify-around px-2 py-2 shadow-2xl">
        {navItems.map((item) => {
          const isActive = activeMenu === item.key || pathname.startsWith(item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-lg transition-all duration-150 min-w-0 flex-1 ${
                isActive ? 'bg-black/20' : 'hover:bg-white/10'
              }`}
            >
              <span className={`text-white ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                {item.icon}
              </span>
              <span className={`text-[11px] font-semibold text-center leading-tight ${isActive ? 'text-white' : 'text-white/70'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default Sidebar;