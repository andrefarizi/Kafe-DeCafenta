import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import MenuClient, { OwnerMenuItem } from './MenuClient';
import { getMenuCatalog } from '@/src/controllers/menu-controller';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const categoryFallbacks: Record<string, string> = {
  Nasi: '/nasi goreng.png',
  Mie: '/bakso.png',
  Snack: '/kentang goreng.png',
  Minuman: '/jus semangka.png',
};

const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);

const formatRating = (value: number) =>
  Number.isFinite(value) ? value.toFixed(1) : '0.0';

export default async function ManajemenMenu() {
  const menus = await getMenuCatalog();

  const items: OwnerMenuItem[] = menus.map((menu) => ({
    id: menu.id,
    name: menu.name,
    price: formatRupiah(menu.price),
    rating: formatRating(menu.avgRating),
    image: menu.imageUrl || categoryFallbacks[menu.categoryName] || '/nasi goreng.png',
    category: menu.categoryName,
    isAvailable: menu.isAvailable ?? true,
  }));

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans text-gray-900 max-w-7xl mx-auto pb-24 md:pb-8">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-black">Manajemen Menu</h1>
        <Link href="/owner/menu/tambah" className="flex items-center space-x-2 bg-[#8B1A1A] hover:bg-red-900 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm">
          <Plus size={16} strokeWidth={3} />
          <span>Tambah Menu</span>
        </Link>
      </div>

      <MenuClient items={items} />

    </div>
  );
}