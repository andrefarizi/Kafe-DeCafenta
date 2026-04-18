'use client';

import Link from 'next/link';

export default function TopBar() {
  return (
    <header className="w-full bg-[#f4d03f] flex items-center justify-between px-6 py-3 shrink-0">
      {/* Logo kiri */}
      <Link href="/owner/beranda" className="flex items-center gap-2">
        <div className="w-9 h-9 bg-[#8b1c1c] rounded-md flex items-center justify-center">
          <span className="text-[#f4d03f] font-black text-lg leading-none">D</span>
        </div>
        <span className="text-[#8b1c1c] font-extrabold text-sm tracking-widest">DE CAFENTA</span>
      </Link>

      {/* Avatar kanan */}
      <button
        id="owner-avatar-btn"
        aria-label="Profile owner"
        className="w-9 h-9 rounded-full bg-[#8b1c1c] flex items-center justify-center hover:opacity-80 transition-opacity"
      >
        {/* User icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-[#f4d03f]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
      </button>
    </header>
  );
}
