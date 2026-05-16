import React from 'react';
import { getKasirOrderDetail } from '@/src/controllers/kasir-order-controller';
import DetailPesananClient from './DetailPesananClient';

export const dynamic = 'force-dynamic';

// Tambahkan Promise pada tipe params untuk Next.js versi terbaru
export default async function DetailPesananPage({ params }: { params: Promise<{ id: string }> }) {
  // Wajib di-await agar ID tidak undefined
  const resolvedParams = await params;
  const orderId = resolvedParams.id;
  
  const orderData = await getKasirOrderDetail(orderId);

  if (!orderData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h1 className="text-2xl font-bold text-black mb-2">Pesanan tidak ditemukan.</h1>
        {/* Ini untuk mengecek apakah ID terbaca dari URL */}
        <p className="text-gray-500">Mencari ID: {orderId}</p>
      </div>
    );
  }

  return <DetailPesananClient order={orderData} />;
}