import React from 'react';
import { getMenuCatalog } from '@/src/controllers/menu-controller';
import KasirKelolaStokClient from './KelolaStokClient';

export const dynamic = 'force-dynamic';

export default async function KelolaStokKasir() {
  const menus = await getMenuCatalog();
  
  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 pb-24 font-sans max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-black">Kelola Stok</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">Perbarui ketersediaan dan stok menu</p>
      </div>

      <KasirKelolaStokClient initialMenus={menus} />
    </div>
  );
}
