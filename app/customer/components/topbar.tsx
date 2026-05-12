'use client';

import { useState, useRef } from 'react';
import { signOut } from 'next-auth/react';
import { LogOut, User } from 'lucide-react';

import { useRouter } from 'next/navigation';

const Topbar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <header className="h-14 bg-[#FFCC00] flex items-center justify-end px-8 w-full">
      {/* Avatar + Dropdown Wrapper */}
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Avatar Button */}
        <button
          id="customer-avatar-btn"
          onClick={() => router.push('/customer/Profil')}
          aria-label="Profile customer"
          aria-expanded={open}
          className="w-10 h-10 rounded-full bg-[#8A0000] flex items-center justify-center hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        <div
          className={`absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 transition-all duration-200 origin-top-right ${
            open
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          {/* Header label */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-[#fdf6e3]">
            <User size={14} className="text-[#8A0000]" />
            <span className="text-xs font-semibold text-[#8A0000] uppercase tracking-wide">
              Customer
            </span>
          </div>

          {/* Logout button */}
          <button
            id="customer-logout-btn"
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 group"
          >
            <LogOut
              size={15}
              className="text-gray-400 group-hover:text-red-600 transition-colors"
            />
            Keluar
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;