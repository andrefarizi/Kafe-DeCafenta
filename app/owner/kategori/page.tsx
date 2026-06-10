import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { getCategories } from '@/src/controllers/menu-controller';
import KategoriClient from './KategoriClient';

export const dynamic = 'force-dynamic';

export default async function KategoriPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans text-gray-900 max-w-4xl mx-auto pb-24 md:pb-8">
      {/* Header Section */}
      <div className="flex items-center mb-8">
        <Link href="/owner/menu" className="mr-4 p-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors mt-1 inline-flex items-center">
          <ChevronLeft size={20} className="text-[#8B1A1A]" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-black">Kelola Kategori</h1>
          <p className="text-sm text-gray-500 font-bold mt-1">Tambah atau Hapus Kategori Menu</p>
        </div>
      </div>

      <KategoriClient initialCategories={categories} />
    </div>
  );
}
