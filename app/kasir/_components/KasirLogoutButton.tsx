'use client';

import { signOut } from 'next-auth/react';

export default function KasirLogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="flex items-center gap-2 bg-[#FFC7C7] px-4 py-2 rounded-md border border-[#6a1713] text-[#6a1713] font-medium text-sm hover:bg-[#ebd5d4] transition"
    >
      <img src="/mingcute_power-fill.png" alt="logout" width={16} height={16} />
      Logout
    </button>
  );
}
