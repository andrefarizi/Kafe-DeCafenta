'use client';

import Link from 'next/link';

export default function TopBar() {
  return (
    <header className="w-full bg-[#f4d03f] flex items-center justify-end px-6 py-3 shrink-0">
      <button
        id="kasir-avatar-btn"
        aria-label="Profile kasir"
        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#8b1c1c] flex items-center justify-center hover:opacity-80 transition-opacity"
      >
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
