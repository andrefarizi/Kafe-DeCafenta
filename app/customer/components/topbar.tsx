'use client';

import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { LogOut, User, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Topbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const toggleDropdown = () => setOpen(!open);

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <header className="h-14 bg-[#FFCC00] flex items-center justify-between md:justify-end px-4 md:px-8 w-full shrink-0">
      {/* Logo / Brand di Mobile */}
      <div className="md:hidden flex items-center gap-2">
        <img src="/Group 2 1.png" alt="Logo" className="h-7 w-auto object-contain" />
        <span className="font-extrabold text-[#8A0000] text-sm tracking-widest">DE CAFENTA</span>
      </div>

      {/* Avatar + Dropdown Wrapper */}
      <div className="relative">
        {/* Avatar Button */}
        <button
          id="customer-avatar-btn"
          onClick={toggleDropdown}
          aria-label="Profile customer"
          aria-expanded={open}
          className="w-10 h-10 rounded-full bg-[#8A0000] flex items-center justify-center hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-md overflow-hidden border-2 border-white"
        >
          {session?.user?.image ? (
            <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover bg-white" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          )}
        </button>

        {open && (
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
        )}

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

          {/* Profil button */}
          <button
            onClick={() => {
              setOpen(false);
              router.push('/customer/Profil');
            }}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-150"
          >
            <User size={15} className="text-gray-400" />
            Profil
          </button>

          {/* Logout button */}
          <button
            id="customer-logout-btn"
            onClick={() => {
              setOpen(false);
              setShowLogoutModal(true);
            }}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 group"
          >
            <LogOut
              size={15}
              className="text-gray-400 group-hover:text-red-600 transition-colors"
            />
            Logout
          </button>
        </div>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Konfirmasi Logout</h2>
            <p className="text-gray-600 mb-6 font-medium">Apakah kamu yakin ingin logout?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-bold rounded-xl transition-colors"
                disabled={isLoggingOut}
              >
                Batal
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-[#8b1c1c] hover:bg-red-800 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? <Loader2 size={16} className="animate-spin" /> : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Topbar;