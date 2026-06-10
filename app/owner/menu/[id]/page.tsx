import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Pencil, Star } from 'lucide-react';
import {
  getMenuDetail,
  getMenuReviews,
} from '@/src/controllers/menu-controller';
import MenuDetailClient from './MenuDetailClient';
import DeleteMenuButton from './DeleteMenuButton';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const categoryFallbacks: Record<string, string> = {
  Nasi: '/nasi goreng.png',
  Mie: '/bakso.png',
  Snack: '/kentang goreng.png',
  Minuman: '/jus semangka.png',
};

const resolveMenuImage = (name: string, categoryName: string, imageUrl: string | null) => {
  if (imageUrl) return imageUrl;
  return categoryFallbacks[categoryName] || '/burger.png';
};

const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);

const formatReviewCount = (count: number) => {
  if (count >= 1000) {
    const short = Math.round(count / 100) / 10;
    return `${short.toString().replace('.', ',')}rb ulasan`;
  }
  return `${count} ulasan`;
};

const formatReviewDate = (value: Date) => {
  return value.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DetailMenu({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const menu = await getMenuDetail(id);

  if (!menu) {
    notFound();
  }

  const reviews = await getMenuReviews(menu.id, 4);
  const reviewSummaryLabel = formatReviewCount(menu.reviewCount);
  const averageRating = Number.isFinite(menu.avgRating) ? menu.avgRating.toFixed(1) : '0.0';

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans text-gray-900 max-w-5xl mx-auto pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link href="/owner/menu" className="mr-4 p-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <ChevronLeft size={20} className="text-[#8B1A1A]" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-black">Detail Menu</h1>
        </div>
        <DeleteMenuButton menuId={menu.id} menuName={menu.name} />
      </div>

      <MenuDetailClient 
        menu={{
          id: menu.id,
          name: menu.name,
          price: menu.price,
          description: menu.description,
          avgRating: averageRating,
          imageUrl: resolveMenuImage(menu.name, menu.categoryName, menu.imageUrl),
          isAvailable: menu.isAvailable,
          isPromo: menu.isPromo,
          discountPercent: menu.discountPercent ?? 0,
          stock: menu.stock ?? null,
        }} 
      />

      <div className="border-[2.5px] border-[#8B1A1A] rounded-[2rem] p-6 md:p-8 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
          <h3 className="text-xl font-extrabold text-black">Ringkasan Ulasan ({reviewSummaryLabel})</h3>
          {reviews.length > 0 && (
            <Link href={`/owner/ulasan/${menu.id}`} className="text-[#8B1A1A] font-extrabold text-sm hover:underline">
              Lihat Semua
            </Link>
          )}
        </div>

        {reviews.length === 0 ? (
          <p className="text-sm font-bold text-gray-600">Belum ada ulasan.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((ulasan) => (
              <div key={ulasan.id} className="flex space-x-4">
                <img
                  src={ulasan.userImage || '/LOGOPROFIL.png'}
                  alt={ulasan.userName}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200"
                />

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-sm text-black">{ulasan.userName}</h4>
                      <p className="text-[10px] text-gray-500 font-medium">{formatReviewDate(ulasan.createdAt)}</p>
                    </div>

                    <div className="bg-[#8B1A1A] flex items-center space-x-1 px-2 py-0.5 rounded-md">
                      <Star size={10} fill="#FFC700" className="text-[#FFC700]" />
                      <span className="text-white text-[10px] font-bold">{ulasan.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-black font-medium mt-3">
                    {ulasan.comment || 'Tanpa komentar.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
