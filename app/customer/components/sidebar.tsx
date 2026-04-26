import React from 'react';
import Image from 'next/image';
import { Home, Menu as MenuIcon, ShoppingCart, ClipboardList } from 'lucide-react';

const NavItem = ({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <div className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-colors ${active ? 'bg-black/20' : 'hover:bg-black/10'}`}>
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </div>
);

const Sidebar = ({ activeMenu }: { activeMenu?: string }) => {
  return (
    <aside className="w-54 bg-[#8A0000] text-white flex flex-col h-screen sticky top-0">
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

      <nav className="flex-1 mt-4">
        <NavItem icon={<Home size={20} />} label="Beranda" active={activeMenu === 'beranda'}/>
        <NavItem 
          icon={
            <Image 
              src="/icon-menu.png" 
              alt="Menu Icon"
              width={20} 
              height={20}
              className="object-contain grayscale brightness-200" 
            />
          } 
          label="Menu" 
          active={activeMenu === 'menu'}
        />
        <NavItem icon={<ShoppingCart size={20} />} label="Keranjang" active={activeMenu === 'keranjang'}/>
        <NavItem icon={<ClipboardList size={20} />} label="Pesanan" active={activeMenu === 'pesanan'}/>
      </nav>
    </aside>
  );
};

export default Sidebar;