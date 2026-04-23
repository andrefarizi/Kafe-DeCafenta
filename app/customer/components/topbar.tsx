import React from 'react';
import { User } from 'lucide-react';

const Topbar = () => {
  return (
    <header className="h-14 bg-[#FFCC00] flex items-center justify-end px-8 w-full">
      <div>
        {/* Avatar kanan */}
        <button
            id="owner-avatar-btn"
            aria-label="Profile owner"
            className="w-10 h-10 rounded-full bg-[#8A0000] flex items-center justify-center hover:opacity-80 transition-opacity"
        >
        {/* User icon */}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 text-[#ffffff]"
            viewBox="0 0 24 24"
            fill="currentColor"
        >
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
        </button>
      </div>
    </header>
  );
};

export default Topbar;